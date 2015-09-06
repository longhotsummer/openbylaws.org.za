$:.unshift("lib")

task :default => [:clean, :build]

desc "Build and deploy site to openbylaws.org.za and reindex for search"
task :deploy => [:clean, :build, :sync, :reindex]

desc "Clean out all build artefacts"
task :clean do
  sh "rm -rf build"
end

desc "Build the website into the build directory"
task :build do
  sh "bundle exec middleman build"
end

desc "Sync changed files to S3"
task :sync do
  sh "bundle exec middleman s3_sync"
end

desc "Re-index all documents for searching, removing any existing indexed documents."
task :reindex do
  require 'middleman'
  require 'act_helpers'
  require 'search'

  ActHelpers.load_bylaws
  docs = ActHelpers.regions.values.map { |r| r.bylaws.documents }.flatten

  ElasticSearchSupport.searcher.reindex!(docs) do |doc, data|
    puts "Indexing #{doc.frbr_uri}"
  end
end
