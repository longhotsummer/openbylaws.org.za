$:.unshift("lib")

task :default => [:clean, :build]

desc "Build and deploy site to openbylaws.org.za and reindex for search"
task :deploy => [:clean, :build, :sync, :reindex]

task :clean do
  sh "rm -rf build"
end

task :build do
  sh "middleman build"
end

desc "Sync changed files to S3"
task :sync do
  sh "middleman s3_sync"
end

desc "Re-index all documents for searching, removing any existing indexed documents."
task :reindex do
  require 'middleman'
  require 'act_helpers'
  require 'search'

  ActHelpers.load_bylaws
  docs = ActHelpers.regions.values.map { |r| r.bylaws.documents }.flatten

  ElasticSearchSupport.searcher.reindex!(docs)
end
