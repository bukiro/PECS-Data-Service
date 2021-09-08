# PECS-MongoDB-Connector

This is a MongoDB connector for the [Pathfinder Excessive Character Sheet](http://github.com/bukiro/PECS). It serves a simple http(s) URL for GET and POST queries and performs the necessary operations on the connected MongoDB database in order to manage and retrieve characters and inter-party event triggers ("messages").

The project was built in node.js 12.14.1. Run `node src/connector.js` to start it. If an SSL certificate and key are provided, the connector will listen on HTTPS and HTTP.

NEW: You can now also download a Windows/Linux executable in releases and run it with no knowledge of node.js - see [releases](https://github.com/bukiro/PECS-MongoDB-Connector/releases).

Before you can start with either method, you need to provide a config.json file. See config.json.example for examples. The parameters are as follows:

- `MongoDBConnectionURL`: your mongodb:// connection URL with user and password (if needed) and all configuration parameters
- `MongoDBDatabase`: The database on your MongoDB server that contains the PECS collections
- `MongoDBCharacterCollection`: The name of the collection that contains the characters.
- `MongoDBMessageCollection`: The name of the collection that contains the messages.
- `HTTPPort`: Your desired HTTP port. Default 8080.
- `HTTPSPort`: Your desired HTTP port. Default 8443.
- `SSLCertificatePath`: The absolute or relative path to your ssl certificate, starting from the path from which you started node.
- `SSLPrivateKeyPath`: The absolute or relative path to your ssl private key matching the certificate, starting from the path from which you started node.