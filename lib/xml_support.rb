# Add some helper methods to XML node objects
class Nokogiri::XML::Node

  # The AkomaNtoso number of this node, or nil if unknown.
  # Major AN elements such as chapters, parts and sections almost
  # always have numbers.
  def num
    node = at_xpath('./a:num', a: AkomaNtoso::NS)
    node ? node.text.gsub('.', '') : nil
  end

  def heading
    node = at_xpath('./a:heading', a: AkomaNtoso::NS)
    node ? node.text : nil
  end

  def id
    self['id']
  end

  def chapters
    xpath('./a:chapter', a: AkomaNtoso::NS)
  end

  def sections
    xpath('./a:section', a: AkomaNtoso::NS)
  end

  def parts
    xpath('./a:part', a: AkomaNtoso::NS)
  end

  # Get a nodeset of child elements of this node which should show
  # up in the table of contents
  def toc_children
    xpath('a:part | a:chapter | a:section', a: AkomaNtoso::NS)
  end

  # Does this element hold children for the table of contents?
  def toc_container?
    !toc_children.empty?
  end
end
