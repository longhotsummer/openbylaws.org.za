require 'nokogiri'

class ActHelpers < Middleman::Extension
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

  # Generate a url for part an act, or a part
  # of an act (section, subsection, chapter, part, etc.)
  def self.act_url(act, child=nil, opts={})
    parts = [act.url_path]

    case child
    when nil
    when Nokogiri::XML::Node
      case child.name
      when "section"
        parts << "/section/#{child.num}/"
      when "part"
        # some parts are only unique within their chapter
        parts << "/chapter/#{child.parent.num}" if child.parent.name == "chapter"
        parts << "/part/#{child.num}/"
      when "chapter"
        # some chapters are only unique within their parts
        parts << "/part/#{child.parent.num}" if child.parent.name == "part"
        parts << "/chapter/#{child.num}/"
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
      ::AkomaNtoso::Act.from_node(node)
    end

    def act_url(act, *args)
      ActHelpers.act_url(act, *args)
    end

    def breadcrumb_heading(act)
      if act.is_a? ::AkomaNtoso::ByLaw
        "By-law of #{act.year}"
      else
        "Act #{act.num} of #{act.year}"
      end
    end

    def breadcrumbs_for_fragment(fragment)
      trail = []

      if %(chapter part).include?(fragment.parent.name)
        trail << fragment.parent
      end

      trail << fragment

      trail
    end

    def toc_title(child)
      case child.name
      when "chapter"
        "Chapter #{child.num} - #{child.heading}"
      when "part"
        "Part #{child.num} - #{child.heading}"
      when "section"
        "#{child.num}. #{child.heading}"
      end
    end
  end
end

::Middleman::Extensions.register(:act_helpers, ActHelpers)
