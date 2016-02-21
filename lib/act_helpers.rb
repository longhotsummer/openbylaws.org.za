require 'hashie'
require 'json'
require 'indigo'

class ActHelpers < Middleman::Extension
  @@bylaws = nil

  def self.load_bylaws
    for code, region in self.regions.each_pair
      region.bylaws = IndigoDocumentCollection.new(IndigoBase::API_ENDPOINT + '/za-' + code)
      puts "Got #{region.bylaws.length} by-laws for #{code}"
    end
  end

  def self.regions
    @@regions ||= Hashie::Mash.new(File.open('regions.json') { |f| JSON.load(f) })
  end

  # Generate a url for part an act, or a part
  # of an act (section, subsection, chapter, part, etc.)
  def self.act_url(act, opts={})
    parts = [act.frbr_uri]

    child = opts[:child]
    case child
    when nil
      # this ensures a trailing slash, which prevents a redirect in S3
      parts << ''
    when String
      parts << child
    when IndigoComponent
      # TOC element
      parts << child.component if child.component and child.component != "main"
      parts << child.subcomponent if child.subcomponent
    end

    url = File.join(parts)

    if opts[:format]
      url.gsub!(/\/+$/, '')
      url << ".#{opts[:format]}"
    end

    if opts[:external]
      url = "https://openbylaws.org.za" + url
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

    def breadcrumbs_for_fragment(fragment)
      trail = []
  
      trail << act_for_node(fragment).schedules if fragment.in_schedules?
      trail << fragment.parent if fragment.parent && %(chapter part).include?(fragment.parent.type)
      trail << fragment
         
      trail
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
      if act.locality == 'cpt'
        year = act.publication_date.split('-')[0]
        "http://www.westerncape.gov.za/general-publication/provincial-gazettes-#{year}"
      end
    end

    def all_bylaws
      ActHelpers.regions.values.map { |r| r.bylaws.documents }.flatten
    end

    def regions
      ActHelpers.regions
    end
  end
end

::Middleman::Extensions.register(:act_helpers, ActHelpers)
