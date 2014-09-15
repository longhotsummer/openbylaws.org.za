require 'support_files'

class ActHelpers < Middleman::Extension
  @@bylaws = nil
  @@support_files = {}

  def initialize(app, options_hash={}, &block)
    super

    @@xslt = {
      :fragment => Nokogiri::XSLT(File.open('xsl/fragment.xsl')),
      :act => Nokogiri::XSLT(File.open('xsl/act.xsl')),
    }
  end

  def self.xslt
    @@xslt
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
    #
    # If +elem+ has an id, we use xpath to tell the XSLT which
    # element to transform. Otherwise we copy the node into a new
    # tree and apply the XSLT to that.
    def fragment_to_html(elem)
      params = transform_params(elem)

      if elem.id
        params['root_elem'] = "//*[@id='#{elem.id}']"
        ActHelpers.xslt[:fragment].transform(elem.document, params).to_s
      else
        # create a new document with just this element at the root
        doc2 = Nokogiri::XML::Document.new
        doc2.root = elem
        params['root_elem'] = '*'

        ActHelpers.xslt[:fragment].transform(doc2, params).to_s
      end
    end

    # Transfrom an entire act into HTML
    def act_to_html(act)
      params = transform_params(act.doc)
      ActHelpers.xslt[:act].transform(act.doc, params).to_s
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
  end
end

::Middleman::Extensions.register(:act_helpers, ActHelpers)
