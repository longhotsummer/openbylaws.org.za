require 'forwardable'

require 'hashie'
require 'nokogiri'
require 'moneta'
require 'httpclient'
require 'json'

CACHE_SECS = 60 * 60 * 24

class IndigoBase
  API_ENDPOINT = ENV['INDIGO_API_URL'] || "https://indigo.openbylaws.org.za/api"
  AUTH_TOKEN = ENV['INDIGO_API_AUTH_TOKEN']

  attr_accessor :api, :url

  @@client = nil

  def initialize(url=API_ENDPOINT)
    unless @@client
      @@client = HTTPClient.new unless @@client
      @@client.default_header['Authorization'] = "Token #{AUTH_TOKEN}" if AUTH_TOKEN
    end

    @url = url
    @cache = Moneta.new(:File, dir: '_cache', expires: true)
  end

  def get(path='', params={})
    path = @url + path unless path.start_with?('http')

    cache = !params.include?(:nocache)
    key = [path, params]
    params.delete(:nocache)

    if cache
      cached = @cache[key]
      return cached if cached
    end

    client = HTTPClient.new
    client.default_header['Authorization'] = "Token #{AUTH_TOKEN}" if AUTH_TOKEN
    response = client.get_content(path, params)

    @cache.store(key, response, expires: CACHE_SECS) if cache

    response
  end
end

class IndigoComponent < IndigoBase
  attr_accessor :info

  def initialize(url, info=nil, parent=nil)
    super(url)

    if info.nil?
      info = JSON.parse(get('.json'))
    end

    @info = _transform(Hashie::Mash.new(info))
    @parent = parent
  end

  def html
    @html ||= get_html
  end

  def get_html
    # fetch html remotely
    get('.html')
  end

  def text
    @text ||= Nokogiri::HTML(html).inner_text
  end

  # make some changes to the incoming hash
  def _transform(item)
    case item
    when Array
      item.each { |e| _transform(e) }
    when Hash
      # dates into Date objects
      for key in [:date, :updated_at, :created_at, :expression_date, :commencement_date, :assent_date, :publication_date]
        if item.has_key? key and item[key].is_a? String
          item[key] = Date.parse(item[key])
        end
      end

      item.each_value { |e| _transform(e) }
    end
  end

  def method_missing(method, *args)
    v = @info.send(method, *args)
    v = @parent.send(method, *args) if not v and @parent
    v
  end
end

class IndigoDocument < IndigoComponent
  def initialize(url, info=nil, collection=nil)
    super(url, info)
    @collection = collection
  end

  def toc
    # Load the TOC remotely
    @toc ||= parse_toc(JSON.parse(get('/toc.json'))['toc'])
  end

  def region_code
    frbr_uri.split('/', 3)[1].split('-')[1]
  end

  def get_html
    get('.html', {coverpage: 0})
  end

  def schedules
    @toc.select { |t| t.component =~ /schedule/ }
  end

  def publication?
    publication_name && publication_number && publication_date
  end

  def amended?
    !amendments.empty?
  end

  def repealed?
    !repeal.nil?
  end

  def attachments
    @attachments ||= JSON.parse(get(attachments_url))['results'].map do |a|
      IndigoComponent.new(a['url'], a)
    end
  end

  def pdf_url
    links.find { |k| k.title == 'PDF' }['href']
  end

  def epub_url
    links.find { |k| k.title == 'ePUB' }['href']
  end

  def standalone_html_url
    "#{@url}.html?standalone=1"
  end

  def source_enacted
    attachments.find { |a| a.filename == 'source-enacted.pdf' }
  end

  def source_current
    attachments.find { |a| a.filename == 'source.pdf' }
  end

  # Return a list of HistoryEvent objects describing the history of this document,
  # oldest first.
  def history
    unless @events
      @events = []

      @events << HistoryEvent.new(assent_date, :assent) if assent_date
      @events << HistoryEvent.new(publication_date, :publication) if publication_date
      @events << HistoryEvent.new(commencement_date, :commencement) if commencement_date
      @events << HistoryEvent.new(added_at, :created)
      @events << HistoryEvent.new(updated_at, :updated)

      for amendment in amendments
        @events << HistoryEvent.new(amendment.date, :amendment, amendment)
      end

      if repealed?
        @events << HistoryEvent.new(repeal.date, :repeal, repeal)
      end

      @events.sort_by! { |e| e.date }
    end

    @events
  end

  def full_publication
    [publication_name, "no.", publication_number].join(" ")
  end

  # Date first version added to the website. This is the earliest created_at date
  # of all the amended versions.
  def added_at
    dates = [self.created_at]
    dates += amended_versions.select(&:id).map { |v| @collection.fetch(v.id) }.compact.map(&:created_at)
    dates.min
  end

  protected
  def parse_toc(items)
    items.map do |item|
      item = IndigoComponent.new(item['url'], item, self)
      if item.children
        item.children = self.parse_toc(item.children)
        item.children.each { |c| c.info.parent = item }
      end
      item
    end
  end
end

# document collection loaded from Indigo
class IndigoDocumentCollection < IndigoBase
  extend Forwardable
  include Enumerable

  attr_accessor :documents
  def_delegators :@documents, :size, :length, :<<, :map, :[], :each

  def initialize(endpoint)
    super(endpoint)
    response = JSON.parse(get('', {nocache: true}))['results']
    @documents = response.map { |doc| IndigoDocument.new(doc['published_url'], doc, self) }
  end

  # try to find a document with this id, otherwise try to fetch it remotely
  def fetch(id)
    doc = @documents.find { |d| d.id == id }
    return doc if doc

    IndigoDocument.new(API_ENDPOINT + "/documents/#{id}", nil, self)
  end

  def for_listing
    # ignore documents that have the 'amendment' tag and are stubs
    @documents.select { |d| !(d.stub and d.tags.include?('amendment')) }
  end
end

class HistoryEvent
  attr_accessor :date
  attr_accessor :event
  attr_accessor :info

  def initialize(date, event, info=nil)
    @date = date
    @event = event
    @info = info
  end
end
