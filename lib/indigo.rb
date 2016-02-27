require 'forwardable'

require 'hashie'
require 'nokogiri'
require 'moneta'

CACHE_SECS = 60 * 60 * 24

class IndigoBase
  API_ENDPOINT = ENV['INDIGO_API_URL'] || "https://indigo.openbylaws.org.za/api"

  attr_accessor :api, :url

  def initialize(url=API_ENDPOINT)
    @url = url
    @client = HTTPClient.new
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

    puts path
    response = @client.get_content(path, params)

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
    @html ||= _link_terms(get_html)
  end

  def get_html
    get('.html')
  end

  def text
    @text ||= Nokogiri::HTML(get_html).inner_text
  end

  # transform <span class="akn-term" .. > tags into links
  # and make the definitions targetable
  def _link_terms(html)
    doc = Nokogiri::HTML(html)

    for term in doc.css('.akn-term')
      term.name = 'a'
      term['href'] = "#{frbr_uri}/#{term['data-refersto']}"
    end

    for defn in doc.css('.akn-def')
      # so we can link to it, see above
      defn['id'] = defn['data-refersto'].sub(/^#/, '')
    end

    doc.to_html
  end

  # make some changes to the incoming hash
  def _transform(item)
    case item
    when Array
      item.each { |e| _transform(e) }
    when Hash
      # dates into Date objects
      for key in [:date, :updated_at, :created_at, :expression_date]
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

  def standalone_html_url
    "#{@url}.html?standalone=1"
  end

  def source_enacted
    attachments.find { |a| a.filename == 'source-enacted.pdf' }
  end

  def source_current
    attachments.find { |a| a.filename == 'source.pdf' }
  end

  # Return a Hash from term_id to a +[term, definition]+ pair,
  # where +term+ is the defined term and +definition+
  # is the HTML for the definition.
  def term_definitions
    unless @term_definitions
      @term_definitions = {}

      # parse the HTML, the find defined terms
      doc = Nokogiri::HTML(html)

      for defn in doc.css('.akn-def')
        term = defn.content
        refersTo = defn['data-refersto']
        definition = defn.ancestors("[data-refersto='#{refersTo}']").first

        if refersTo and definition
          @term_definitions[refersTo.sub(/^#/, '')] = [term, definition.to_html]
        end
      end
    end

    @term_definitions
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
    @documents = response.map { |doc| IndigoDocument.new(doc['published_url'], doc) }
  end
end
