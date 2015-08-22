require 'forwardable'

require 'rest-client'
require 'restclient/components'
require 'rack/cache'
require 'hashie'

# We want to cache files locally to make development faster,
# and it's convenient to use Rack::Cache to do this. However,
# the Indigo API doesn't mark its content as cacheable, so
# we jump in and fake that.
class FakeCacheable
  def initialize(app, options={})
    @app = app
    @secs = options[:seconds] || 86400
  end

  def call(env)
    status, headers, body = @app.call(env)
    headers['Cache-Control'] = "max-age=#{@secs}"
    [status, headers, body]
  end
end

RestClient.enable(Rack::Cache,
                  verbose: true,
                  metastore: 'file:_cache/meta', 
                  entitystore: 'file:_cache/body',
                  allow_reload: true)
RestClient.enable(FakeCacheable)

class IndigoBase
  API_ENDPOINT = ENV['INDIGO_API_URL'] || "http://indigo.openbylaws.org.za/api"

  attr_accessor :api, :url

  def initialize(url=API_ENDPOINT)
    @url = url
    @api = RestClient::Resource.new(url)
  end
end

class IndigoComponent < IndigoBase
  attr_accessor :info

  def initialize(url, info=nil)
    super(url)

    if info.nil?
      info = JSON.parse(@api['.json'].get())
    end

    @info = _transform(Hashie::Mash.new(info))
  end

  def html
    @api['.html'].get
  end

  # make some changes to the incoming hash
  def _transform(item)
    case item
    when Array
      item.each { |e| _transform(e) }
    when Hash
      # dates into Date objects
      if item.has_key? :date and item.date.is_a? String
        item.date = Date.parse(item.date)
      end

      item.each_value { |e| _transform(e) }
    end
  end

  def method_missing(method, *args)
    @info.send(method, *args)
  end
end

class IndigoDocument < IndigoComponent
  def toc
    # Load the TOC remotely
    @toc ||= parse_toc(JSON.parse(@api['toc.json'].get())['toc'])
  end

  def html
    @api['.html'].get(params: {coverpage: 0})
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
    @attachments ||= JSON.parse(RestClient.get(attachments_url)).map do |a|
      IndigoComponent.new(a['url'], a)
    end
  end

  def source_enacted
    attachments.find { |a| a.filename == 'source-enacted.pdf' }
  end

  def source_current
    attachments.find { |a| a.filename == 'source.pdf' }
  end

  protected
  def parse_toc(items)
    items.map do |item|
      item = IndigoComponent.new(item['url'], item)
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
    response = JSON.parse(@api.get(cache_control: 'no-cache'))
    @documents = response.map { |doc| IndigoDocument.new(doc['published_url'], doc) }
  end
end
