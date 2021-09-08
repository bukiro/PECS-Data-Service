This is a standalone executable to host a MongoDB connector for your PECS server. It is intended to run in tandem with the PECS server and save you the effort of installing and configuring node.js.
Some steps are necessary to create a database connection:

1. MongoDB can be downloaded for free at https://www.mongodb.com/. You can also host a free database on the MongoDB Atlas servers and connect to that. Make sure to create a database user for the connection that has read and write permissions on your PECS database.

2. Before the executable can start, you need a config.json file. You can copy and rename config.json.examble to see all the possible options:

HTTPPort (optional, default 8080)  : The insecure port where the connector is going to run. Unless you are using HTTPS, you should enter http://<your-url-or-ip>:<HTTPPort> in dbConnectionURL property in the config file for PECS. You must use the same protocol for both the connector and PECS.
HTTPSPort (optional, default 8443) : The alternative SSL port to use for more security. If you are using HTTPS, the dbConnectionURL should be https://<your-url-or-ip>:<HTTPSPort> .
SSLCertificatePath (optional)      : If you want to use HTTPS, you need an SSL certificate. This is the path to where certificate lies.
SSLPrivateKeyPath (optional)       : If you want to use HTTPS, your SSL certificate needs a private key. This is the path to the key. Password-protected private keys are not supported.
MongoDBConnectionURL               : This is the connection URL for your MongoDB Database. Both MongoDB Atlas and MongoDB Compass can show you the exact url to use for your database. If the database requires an authenticated user for the connection, you must enter the user and password here. MongoDB Atlas always requires authenticated users.
MongoDBDatabase                    : The name of the MongoDB database that you will connect to.
MongoDBCharacterCollection         : The name of the collection in the database where the character are stored.
MongoDBMessagesCollection          : The name of the messages collection in the database.

3. When the config file is finished, you can start the connetor by running the executable: On Windows, run connector.exe, and on Linux, run connector.