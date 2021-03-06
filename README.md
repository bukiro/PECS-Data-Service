# PECS Data Service

This is a data service for the [Pathfinder Excessive Character Sheet](http://github.com/bukiro/PECS). It serves a simple http(s) server for GET and POST queries and performs the necessary operations on either the locally stored data file or a connected MongoDB database in order to manage and retrieve characters. The service also exchanges inter-party event triggers ("messages") between players.

# Compatibility

PECS Data Service v1.0.4 requires PECS v1.0.10, and vice versa.

# Running the service

If you are running PECS from a release, you don't need this. The PECS application includes all functions of the service. You only need it if you are running PECS directly from Node.js for development purposes.

The simple way to run the service is to download a [release](https://github.com/bukiro/PECS-MongoDB-Connector/releases/latest) and start the executable on Windows or Linux. This will serve an HTTP server on Port 8080 with a local data file (stored in your home or appdata folder). You can run an HTTPS server if you provide the certificates via config.json, and you can optionally connect to a running MongoDB database instead of the local database.

If you prefer running the service in Node.js, the same rules apply, but you need to clone the repository, run `npm install` in the repository folder and then start the service via `node src/service.js`. The project was built in Node.js 12.14.1.

The config.json file can be configured with the following parameters (see config.json.example for examples):

- `HTTPPort`: Your desired HTTP port. Default 8080.
- `HTTPSPort`: Your desired HTTP port. Default 8443.
- `SSLCertificatePath`: The absolute or relative path to your ssl certificate, starting from the path from which you started node.
- `SSLPrivateKeyPath`: The absolute or relative path to your ssl private key matching the certificate, starting from the path from which you started node.
- `Password`: An optional password that will be required by PECS before players can use it.
- `MongoDBConnectionURL`: your mongodb:// connection URL with user and password (if needed) and all configuration parameters
- `MongoDBDatabase`: The database on your MongoDB server that contains the PECS collections
- `MongoDBCharacterCollection`: The name of the collection that contains the characters.
- `ConvertMongoDBToLocal`: Only used to convert characters from MongoDB to the local data file. Requires MongoDBConnectionURL and MongoDBDatabase, and the service cannot be connected to while all three parameters are configured. It will stop after conversion.