module AkomaNtoso
  class SupportFile
    # on-disk filename of this file
    attr_accessor :filename

    # path portion of the URL for this file
    attr_accessor :url

    def self.find(filename, base_url)
      return nil unless File.exists?(filename)

      SupportFile.new(filename, File.join(base_url, File.basename(filename)))
    end

    def initialize(filename, url)
      @filename = filename
      @url = url
    end

    # Size of the file in bytes
    def size
      File.size(@filename)
    end
  end

  class SupportFileCollection

    # Source document for the original enacted version
    attr_accessor :source_enacted

    # Source document for the current version
    attr_accessor :source_current

    # Akoma Ntoso document for the current version of this act.
    attr_accessor :akoma_ntoso_current

    def self.for_act(act)
      return nil unless act.filename

      filename = act.filename
      dir = File.dirname(filename)
      basename = File.join(dir, File.basename(filename).gsub('.xml', ''))

      # build up the collection
      files = SupportFileCollection.new

      files.akoma_ntoso_current = SupportFile.find(filename, act.url_path)

      files.source_enacted = SupportFile.find("#{basename}-source-enacted.pdf", act.url_path)
      files.source_current = SupportFile.find("#{basename}-source.pdf", act.url_path)

      files
    end
  end
end
