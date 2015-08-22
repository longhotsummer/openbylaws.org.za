# Open By-laws South Africa

This is the source code for the [openbylaws.org.za](http://openbylaws.org.za) website.

The by-laws themselves are in the [za-by-laws repo](https://github.com/longhotsummer/za-by-laws).

Contributions are welcome!

# Development and Contributing

To setup a local development environment:

1. clone this repo
2. clone the [za-by-laws repo](https://github.com/longhotsummer/za-by-laws) repo alongside this one
3. install dependencies: `bundle install`
4. run the server: `middleman --reload-paths lib`
5. make your changes and submit a pull request

# Deploying

The built website is deployed to s3. You'll need to put the S3 creds in `.s3_sync`.

To build and sync the entire site, run

    rake deploy

To just build the local site, run

    rake

To copy all the XML and PDFs into the build directory, run

    rake resources

To sync the build directory into S3, run

    rake sync

# Licence

The XML and HTML versions of the legislation documents are licensed under a
[Creative Commons Attribution 2.5 South Africa License](http://creativecommons.org/licenses/by/2.5/za/deed.en_US). 

The website software, excluding the HTML and XML versions of the legislation documents,
is licensed under the MIT license.

See [LICENSE](LICENSE) for full license information.
