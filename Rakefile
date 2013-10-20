task :default => [:clean, :build, :resources]
task :deploy => [:clean, :build, :resources, :sync]

task :clean do
  sh "rm -rf build"
end

task :build do
  sh "middleman build"
end

task :resources => [:pdfs, :xml]

task :pdfs do
  # copy pdfs 
  for f in FileList['../za-by-laws/by-laws/**/*.pdf']
    fname = File.basename(f)

    dir = File.join("build", "za", "by-law", File.dirname(f).split("/")[-2..-1])
    g = fname.gsub(/-(source|enacted)/, '')
    dir = File.join(dir, "/", g.split('.', 2)[0])

    cp f, File.join(dir, fname), verbose: true
  end
end

task :xml do
  # copy over XML
  for f in FileList['../za-by-laws/by-laws/**/*.xml']
    fname = File.basename(f)

    dir = File.join("build", "za", "by-law", File.dirname(f).split("/")[-2..-1])
    dir = File.join(dir, "/", fname[0..-5])

    cp f, File.join(dir, fname), verbose: true
  end
end

task :sync do
  sh "middleman s3_sync"
end
