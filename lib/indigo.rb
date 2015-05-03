require 'forwardable'

require 'rest-client'
require 'hashie'

class IndigoBase
  API_ENDPOINT = ENV['INDIGO_API_URL'] || "http://bylaws-indigo.herokuapp.com/api"

  attr_accessor :api, :url

  def initialize(url=API_ENDPOINT)
    @url = url
    @api = RestClient::Resource.new(url)
  end
end

class IndigoComponent < IndigoBase
  attr_accessor :info

  def initialize(url, info)
    super(url)
    @info = Hashie::Mash.new(info)
  end

  def html
    @api['.html'].get()
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

  def schedules
    @toc.select { |t| t.component =~ /schedule/ }
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
    response = JSON.parse(@api.get())
    @documents = response.map { |doc| IndigoDocument.new(doc['published_url'], doc) }
  end
end
