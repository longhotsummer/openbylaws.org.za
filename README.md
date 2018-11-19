# Open By-laws South Africa [![Build Status](https://travis-ci.org/longhotsummer/openbylaws.org.za.svg)](http://travis-ci.org/longhotsummer/openbylaws.org.za)

This is the source code for the [openbylaws.org.za](http://openbylaws.org.za) website.

The website is a [Middleman](http://middlemanapp.com) app that pulls by-law data from the [Indigo](https://github.com/OpenUpSA/indigo) service running at [indigo.openbylaws.org.za](http://indigo.openbylaws.org.za) and builds a static website. The website is then uploaded to Amazon S3 and served over HTTPS using an Amazon Cloudfront distribution.

Contributions are welcome!

# Development and Contributing

To setup a local development environment:

1. clone this repo
2. install dependencies: `bundle install`
3. get auth token from [indigo.openbylaws.org.za](https://indigo.openbylaws.org.za)
3. run the server: `INDIGO_API_AUTH_TOKEN=xxx middleman`

The website pulls all data from [indigo.openbylaws.org.za](http://indigo.openbylaws.org.za).
It caches responses from Indigo in the `_cache` directory for 24 hours which makes local development
simpler. The list of by-laws is never cached. If you know your cache is out of date, just `rm -rf _cache`.

# Building and deploying

The website can be built using:

    rake build

The website is automatically built and deployed by [travis-ci.org](https://travis-ci.org/longhotsummer/openbylaws.org.za) when changes are pushed to the `master` branch.

To upload the built site by syncing the `build` directory with S3,
put the S3 creds in `.s3_sync` and then run:

    rake sync

To build and sync the entire site just like Travis does (ie. clean, build and sync), run:

    rake deploy

# Adding a new municipality

1. Add the municipality to `regions.json`, copying one of the existing regions **that doesn't have a microsite attribute.**
2. Use the municipality code as per https://en.wikipedia.org/wiki/List_of_municipalities_in_South_Africa
3. Source a placard image and save it as `/img/municipalities/<code>-placard.jpg`
4. Source the municipality's logo and save it as `/img/municipalities/<code>-logo.png`

# Architecture

The website is a Ruby [Middleman](http://middlemanapp.com) app that realies
heavily on the [Indigo](https://github.com/OpenUpSA/indigo) service running at
[indigo.openbylaws.org.za](http://indigo.openbylaws.org.za) for its content. Indigo
provides all the by-law metadata, table of contents, rendered HTML, attachments, etc.
The middleman app simply pulls it all together into a website.

The website focuses on a single country (South Africa) but can easily be modified
to work for other countries. The country has **regions** which have by-laws associated
with them. The details of the regions are in `regions.json`.

When the app starts up, it asks indigo.openyblaws.org.za for a list of by-laws
for each region and the table of contents for each by-law. It then generates a page
for each by-law and each item in the table of contents.

To deploy the site, a full copy is generated locally and then uploaded to S3.

# Licence

The XML and HTML versions of the legislation documents are licensed under a
[Creative Commons Attribution 2.5 South Africa License](http://creativecommons.org/licenses/by/2.5/za/deed.en_US). 

The website software, excluding the HTML and XML versions of the legislation documents,
is licensed under the MIT license.

See [LICENSE](LICENSE) for full license information.
