# Open By-laws South Africa

This is the source code for the [openbylaws.org.za](http://openbylaws.org.za) website.

The by-laws themselves are in [indigo.openbylaws.org.za](http://indigo.openbylaws.org.za) and pulled into this website through the Indigo API.

The old by-laws are also in the [za-by-laws repo](https://github.com/longhotsummer/za-by-laws).

Contributions are welcome!

# Development and Contributing

To setup a local development environment:

1. clone this repo
3. install dependencies: `bundle install`
4. run the server: `middleman --reload-paths lib`

The website loads its data from [indigo.openbylaws.org.za](http://indigo.openbylaws.org.za) and caches
the responses in `_cache` for efficiency.

# Deploying

The built website is deployed to S3. You'll need to put the S3 creds in `.s3_sync`.

To build and sync the entire site, run

    rake deploy

To just build the local site, run

    rake

To sync the build directory into S3, run

    rake sync

To reindex the documents for search, run

    rake reindex

# Licence

The XML and HTML versions of the legislation documents are licensed under a
[Creative Commons Attribution 2.5 South Africa License](http://creativecommons.org/licenses/by/2.5/za/deed.en_US). 

The website software, excluding the HTML and XML versions of the legislation documents,
is licensed under the MIT license.

See [LICENSE](LICENSE) for full license information.
