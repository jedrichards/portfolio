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
- API routes are defined in a declarative manner which could allow for easy self-documentation or automated generation of a test harness in future.
- Restify does not provide any session management or authentication so I rolled my own code for this. The [node.bcrypt.js](https://github.com/ncb000gt/node.bcrypt.js) crypto library is used to hash user details in the database and provide session authentication.
- Session tracking is achieved via a session id which is stored in the database and passed to the client as a HTTP-only cookie. Clients are fingerprinted via a hash of their IP and user agent string to provide a basic level of protection against session hijacking.
- Clients wishing to authenticate and access full API functionality (`POST`, `PUT` and `DELETE` actions for example) must authenticate by including a Base64 hash of their username and password in the `Authorization` header along with the request.