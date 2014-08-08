$:.unshift('lib')

require 'by_law'
require 'act_helpers'

###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# ----------------------------------------------------------------------
# Proxy pages (http://middlemanapp.com/dynamic-pages/)

def pages_for(act)
  path = act.url_path.chomp('/')

  # full act
  proxy "#{path}/index.html", "/templates/act/index.html", :locals => { :act => act }, :ignore => true

  # table of contents
  proxy "#{path}/contents/index.html", "/templates/act/contents.html", :locals => { :act => act }, :ignore => true

  # resources
  proxy "#{path}/resources/index.html", "/templates/act/resources.html", :locals => { :act => act }, :ignore => true

  # definitions, usually a duplicate of section 1
  if defn = act.definitions
    proxy "#{path}/definitions/index.html", "/templates/act/fragment.html", :locals => { :act => act, fragment: defn }, :ignore => true
  end

  # sections, chapters, parts, etc.
  subpages_for(act, act.body)

  # schedules
  if schedules = act.schedules
    proxy "#{path}/schedules/index.html", "/templates/act/fragment.html", :locals => { :act => act, fragment: schedules }, :ignore => true
    subpages_for(act, act.schedules)
  end
end

def subpages_for(act, node)
  for child in node.toc_children
    proxy ActHelpers.act_url(act, child) + "index.html", "/templates/act/fragment.html", :locals => { act: act, fragment: child }, :ignore => true
    subpages_for(act, child) if child.toc_container?
  end
end

# By Laws
bylaws = ActHelpers.all_bylaws
bylaws.each { |bylaw| pages_for(bylaw) }

proxy "/za/by-law/index.html", "/templates/bylaws.html", locals: {bylaws: bylaws}, ignore: true

# region pages
for code in bylaws.map(&:region).uniq
  region_bylaws = bylaws.select { |b| b.region == code }.sort_by { |b| b.short_title }
  proxy "/za/by-law/#{code}/index.html", "/templates/region.html", locals: {bylaws: region_bylaws, region: data.geo.regions[code]}, ignore: true
end

# Ignore templates
ignore "/templates/**/*"

# ----------------------------------------------------------------------

###
# Helpers
###

activate :act_helpers

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# activate :livereload

helpers do
  # Simple caching. Use this in a view to avoid re-generating
  # expensive partials. Any array of hashable arguments can be used
  # as a key. It is only used during the build phase, not during
  # development.
  def with_cache(*key, &block)
    value = cache.fetch(*key) do
      value = capture_html(&block)
    end

    concat_content(value)
  end
end

set :css_dir, 'css'

set :js_dir, 'js'

set :images_dir, 'img'

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  activate :relative_assets

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  activate :asset_hash, ignore: [/favicon.*/]

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_path, "/Content/images/"
end

activate :s3_sync do |s3_sync|
  # creds are store in .s3_sync
  s3_sync.bucket                     = 'openbylaws.org.za'
  s3_sync.region                     = 'eu-west-1'
  s3_sync.delete                     = false # We delete stray files by default.
  s3_sync.after_build                = false # We chain after the build step by default. This may not be your desired behavior...
  s3_sync.prefer_gzip                = true
  s3_sync.reduced_redundancy_storage = false

  # cache policies
  year = 60*60*24*365
  day = 60*60*24

  # we use asset hashing here, so have expiry far in the future
  s3_sync.add_caching_policy 'text/css', max_age: year
  s3_sync.add_caching_policy 'application/javascript', max_age: year

  # cache HTML for up to a day
  s3_sync.add_caching_policy 'text/html', max_age: day
end
