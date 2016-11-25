# downpour

Downpour is an interface for Deluge WebUI's API, built with bootstrap and
angular2. Check out the images [here][images] and the demo video [here][video]!

## Building

To build, run the following command.

    $ yarn && yarn run build

## Running
After building, install [`http-server`][http-server] and run:

    http-server -path dist -redirect index.html -proxy-from "/deluge/" -proxy-to "http://localhost:8112"

## Setting It Up
Unfortunately, deluge removed an internal API which would have made installation
as easy as installing a plugin. Currently the only way to run this is by setting
up a reverse proxy to your deluge instance and hosting downpour as a single page
application under the same server. This can be done in nginx by using the
following configuration.

    server {
      # ...
      location /dg/ {
        # The location of your deluge-webui instance. The trailing slash is
        # important.
        proxy_pass http://localhost:8112/;

        # The following line is only required if you still want the default
        # webui to be accessable.
        proxy_set_header X-Deluge-Base "/dg/";
      }

      # The path on the server you want to host downpour from.
      location /path/ {
        # Replace path with your path to downpour relative to the server's root
        # directory
        try_files $uri /path/index.html =404;
      }
    }

Also, in your index.html change the base tag to the path where you keep
downpour. Make sure to include the trailing slash.

    <base href='/path/'>

Lastly, make sure you have installed and enabled deluge's webui.

## Contributing

If you are confused about what something does, want to see a new feature
added, or find something that doesn't work, please open an issue so we can make
this better.

[images]: https://github.com/caffinatedmonkey/downpour/tree/master/images
[video]: https://www.youtube.com/watch?v=vjqBG-gBDBI
[http-server]: https://github.com/caffinatedmonkey/http-server

