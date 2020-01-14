require 'hashie'
require 'json'
require 'indigo'
require 'set'

class ActHelpers < Middleman::Extension
  @@bylaws = nil
  @@active_regions = []

  cattr_accessor :active_regions

  def self.setup(regions)
    self.active_regions = regions

    puts "Using Indigo at #{IndigoBase::API_ENDPOINT}"
    for region in self.active_regions
      region.bylaws = IndigoDocumentCollection.new(IndigoBase::API_ENDPOINT + '/za-' + region.code)
      puts "Got #{region.bylaws.length} by-laws for #{region.code}"
    end
  end

  def self.general_regions
    # non-microsite regions
    self.regions.values.reject { |region| region.microsite }
  end

  def self.regions
    @@regions ||= Hashie::Mash.new(self.raw_regions)
  end

  def self.raw_regions
    File.open('regions.json') { |f| JSON.load(f) }
  end

  # Generate a url for part an act, or a part
  # of an act (section, subsection, chapter, part, etc.)
  def self.act_url(act, opts={})
    parts = [act.frbr_uri]

    lang = opts[:language]
    if lang != false
      parts << (lang.nil? ? act.language : lang)
    end

    child = opts[:child]
    case child
    when nil
      # this ensures a trailing slash, which prevents a redirect in S3
      parts << ''
    when String
      parts << child
    when IndigoComponent
      # TOC element
      parts << ""  # ensure trailing slash

      if child.type == "doc"
        # schedules have IDs in the html
        parts << "##{child.component}"
      elsif child.info.id or child.subcomponent
        id = "#"
        id << "#{child.component}/" if child.component != "main"
        id << (child.info.id || child.subcomponent)
        parts << id
      end
    end

    url = File.join(parts)

    if opts[:format]
      url.gsub!(/\/+$/, '')
      url << ".#{opts[:format]}"
    end

    if opts[:external]
      url = "http://openbylaws.org.za" + url
    end

    url
  end

  helpers do
    def act_url(act, *args)
      ActHelpers.act_url(act, *args)
    end

    def region_url(region)
      IndigoBase::API_ENDPOINT + '/za-' + region.code
    end

    # suitable title for this item in the table of contents
    def toc_title(item)
      case item.type
      when "section"
        if not item.heading or item.heading.empty?
          "Section #{item.num}" 
        elsif item.num
          "#{item.num} #{item.heading}"
        else
          item.heading
        end
      when "part", "chapter"
        "#{item.type.capitalize} #{item.num} - #{item.heading}"
      else
        if item.heading? and !item.heading.empty?
          item.heading
        else
          s = item.type.capitalize
          s += " #{item.num}" if item.num
          s += " - #{item.heading}" if item.heading
          s
        end
      end
    end

    def publication_url(act)
      case act.locality
      when 'cpt', 'wc033'
        year = act.publication_date.year
        "http://www.westerncape.gov.za/general-publication/provincial-gazettes-#{year}"
      when 'eth'
        'https://www.lawsoc.co.za/default.asp?id=1753'
      when 'ec443'
        'http://www.gpwonline.co.za/Gazettes/Pages/Provincial-Gazettes-Eastern-Cape.aspx'
      end
    end

    def all_bylaws
      ActHelpers.active_regions.map { |r| r.bylaws.documents }.flatten
    end

    def regions
      ActHelpers.regions
    end

    def raw_regions
      ActHelpers.raw_regions
    end
  end
end

::Middleman::Extensions.register(:act_helpers, ActHelpers)
