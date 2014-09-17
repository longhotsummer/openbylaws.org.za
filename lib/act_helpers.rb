require 'support_files'

class ActHelpers < Middleman::Extension
  @@bylaws = nil
  @@support_files = {}

  def initialize(app, options_hash={}, &block)
    super
    @@renderer = Slaw::Render::HTMLRenderer.new
  end

  def self.all_bylaws
    unless @@bylaws
      @@bylaws = Slaw::DocumentCollection.new
      @@bylaws.discover("../za-by-laws/by-laws", Slaw::ByLaw)
    end

    @@bylaws
  end

  def self.support_files_for(act)
    @@support_files[act] ||= ::AkomaNtoso::SupportFileCollection.for_act(act)
  end

  def self.regions
    @@regions ||= Hashie::Mash.new(File.open('../za-by-laws/regions/regions.json') { |f| JSON.load(f) })
  end

  # Generate a url for part an act, or a part
  # of an act (section, subsection, chapter, part, etc.)
  def self.act_url(act, child=nil, opts={})
    parts = [act.url_path]

    case child
    when nil
    when Nokogiri::XML::Node
      if child == act.schedules
        parts << "/schedules/"
      else
        chapter_name = child.in_schedules? ? 'schedule' : 'chapter'
        num = child.num

        # some sections don't have numbers :(
        if !num
          if child == act.definitions
            num = 'definitions'
          else
            num = child.heading.downcase
          end
        end

        case child.name
        when "section"
          parts << "/section/#{num}/"
        when "part"
          # some parts are only unique within their chapter
          parts << "/#{chapter_name}/#{child.parent.num}" if child.parent.name == "chapter"
          parts << "/part/#{num}/"
        when "chapter"
          # some chapters are only unique within their parts
          parts << "/part/#{child.parent.num}" if child.parent.name == "part"
          parts << "/#{chapter_name}/#{num}/"
        end
      end
      
      # TODO: subsection
    when String
      parts << child
    when Hash
      opts = child
    end

    url = File.join(parts)

    if opts[:format]
      url.gsub!(/\/+$/, '')
      url << ".#{opts[:format]}"
    end

    url
  end

  helpers do
    def transform_params(node)
      {
        'base_url' => "'#{act_url(act_for_node(node))}'"
      }
    end

    # Transfrom an element in an AkomaNtoso XML document
    # into a HTML by applying the XSLT to just the element
    # passed in.
    def fragment_to_html(elem)
      @@renderer.render_node(elem, act_url(act_for_node(elem)))
    end

    # Transfrom an entire act into HTML
    def act_to_html(act)
      @@renderer.render(act.doc, act_url(act))
    end

    def act_for_node(node)
      ::Slaw::Act.for_node(node)
    end

    def act_url(act, *args)
      ActHelpers.act_url(act, *args)
    end

    def breadcrumb_heading(act)
      if act.is_a? ::Slaw::ByLaw
        "By-law of #{act.year}"
      else
        "Act #{act.num} of #{act.year}"
      end
    end

    def breadcrumbs_for_fragment(fragment)
      trail = []
  
      if fragment.in_schedules?
        trail << act_for_node(fragment).schedules
      end

      if %(chapter part).include?(fragment.parent.name)
        trail << fragment.parent        
      end

      trail << fragment
         
      trail
    end

    def publication_url(act)
      if act.region == 'cape-town'
        year = act.publication['date'].split('-')[0]
        "http://www.westerncape.gov.za/general-publication/provincial-gazettes-#{year}"
      end
    end

    def all_bylaws
      ActHelpers.all_bylaws
    end

    def support_files_for(act)
      ActHelpers.support_files_for(act)
    end

    def regions
      ActHelpers.regions
    end
  end
end

::Middleman::Extensions.register(:act_helpers, ActHelpers)
