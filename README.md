## portfolio

My personal portfolio. Features a JavaScript client and CMS which consumes a Node.JS RESTful API backend. Also includes a GruntJS based approach for automated building, testing and deployment.

I've added the code to GitHub, sans sensitive configuration files, so that prospective employers, clients and colleagues can have a snoop around my code.

Take a look at the live version here [seisaku.co.uk](http://seisaku.co.uk).

### API

The API is written in Node.JS and feeds off a NoSQL MongoDB database. The API has the following features:

- Uses the [Mongoose](http://mongoosejs.com/) Node.js driver for connecting to the database.
- Uses the [Restify](http://mcavage.github.com/node-restify/) framework to provide a set of REST endpoints for the portfolio client and CMS to interact with.
- Proper HTTP verbs, well formed header metadata and pertinent HTTP status codes are all leveraged to ensure predictable and robust operation for a variety of connecting clients.
- CORS headers are used to allow cross origin data access by clients.
- Automated building, async BDD-style testing and deployment to a Linode production server is achieved via [Grunt](http://gruntjs.com/) and [VowsBDD](http://vowsjs.org).
- Although not detailed in this repo the Node.js API is mananaged on the Linode using Upstart and Monit.
- API is configured for production vs. development environments via an external `config.js` file (not present in this repo) which is deployed along with the Node.js application code.
- API routes are defined in a declarative manner which could allow for easy self-documentation or automated generation of a test harness in future.
- Restify does not provide any session management or authentication so I rolled my own custom middleware for this. The [node.bcrypt.js](https://github.com/ncb000gt/node.bcrypt.js) crypto library is used to hash and salt user details in the database.
- Client session data is stored in the database. Session ids are passed to the client as a HTTP-only cookie and clients are fingerprinted via a salted hash of their IP and user agent string to provide a basic level of protection against session hijacking.
- Clients wishing to authenticate and access full REST API functionality (`POST`, `PUT` and `DELETE` actions for example) must authenticate by including a Base64 hash of their username and password in the `Authorization` header along with the request. The production API should support HTTPS to secure user credentials in transit.

### Client and CMS

The portfolio client site and CMS are served normally via Apache. The client has the following features:

- A good separation of concerns is achieved by keeping the client and backend code bases distinct.
- Seamless integration with the REST API via Backbone models.
- `Backbone.sync` and `$.ajaxTransport` functions extended to support CORS.
- Highly modular code structure achieved via [RequireJS](http://requirejs.org).
- [Twitter Bootstrap](http://twitter.github.com/bootstrap/) used to rapidly build out the CMS UI.
- The JavaScript web apps that comprise the portfolio client site and CMS, while served from two different URLs, are able to share a code base enabling the reuse and sharing of model and database code.
- A [SMACSS](https://smacss.com) approach used for the portfolio CSS, all written in [SCSS](http://sass-lang.com).
- Utilisation of Backbone's HTML5 pushState history API support, including .htaccess rewrite rules for full Apache integration.
- A comprehensive automated build and deployment step via [Grunt](http://gruntjs.com/) which is capable of linting the JS via [JSHint](http://www.jshint.com), optimising and compressing the JS app code via the RequireJS [r.js](https://github.com/jrburke/r.js) optimiser, testing, minifying the CSS and finally deploying the production-ready code to a remote server location via [grunt-rsync](https://github.com/jedrichards/grunt-rsync).