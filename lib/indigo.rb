require 'forwardable'

require 'rest_client'
require 'hashie'

class IndigoBase
  API_ENDPOINT = "http://bylaws-indigo.herokuapp.com/api"

  attr_accessor :api, :url

  def initialize(url=API_ENDPOINT)
    @url = url
    @api = RestClient::Resource.new(url)
  end
end

class IndigoDocument < IndigoBase
  attr_accessor :doc

  def initialize(url, doc)
    super(url)
    @info = Hashie::Mash.new(doc)
  end

  def toc
    @toc ||= JSON.parse(@api['toc.json'].get())['toc']
  end

  def method_missing(method, *args)
    return @info.send(method, *args) if @info.respond_to?(method)
    super
  end
end

# document collection loaded from Indigo
class IndigoDocumentCollection < IndigoBase
  extend Forwardable
  include Enumerable

  attr_accessor :documents
  def_delegators :@documents, :size, :<<, :map, :[], :each

  def initialize(endpoint)
    super(endpoint)
    response = JSON.parse(@api.get())
    @documents = response.map { |doc| IndigoDocument.new(doc['published_url'], doc) }
  end
end
