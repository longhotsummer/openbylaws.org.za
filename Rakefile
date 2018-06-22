$:.unshift("lib")

task :default => [:clean, :build]

desc "Build and deploy site to openbylaws.org.za"
task :deploy => [:clean, :build, :sync]

desc "Clean out all build artefacts"
task :clean do
  sh "rm -rf build"
end

desc "Build the website into the build directory"
task :build do
  region = ENV['REGION'] || ''
  env = region != '' ? 'microsite' : 'openbylaws'

  # We run with --verbose so that we get stack traces on errors, which
  # makes debugging builds much simpler. But this makes the log huge
  # so we trim it down by removing some lines
  sh "bundle exec middleman build --verbose -e #{env}"
end

desc "Sync changed files to S3"
task :sync do
  sh "bundle exec middleman s3_sync"
end
