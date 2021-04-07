var express = require('express');
var cors = require('cors');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var fs = require('fs');

var config = require('./config.json')

var HTTPPort = config.HTTPPort || 8080;
var HTTPSPort = config.HTTPSPort || 8443;
var MongoDBConnectionURL = config.MongoDBConnectionURL || "";
var MongoDBDatabase = config.MongoDBDatabase || "";
var MongoDBCharacterCollection = config.MongoDBCharacterCollection || "";
var SSLCertificatePath = config.SSLCertificatePath || "";
var SSLPrivateKeyPath = config.SSLPrivateKeyPath || "";

var app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if (MongoDBConnectionURL && MongoDBDatabase && MongoDBCharacterCollection) {
    mongodb.connect(MongoDBConnectionURL, function (err, client) {
        var db = client.db(MongoDBDatabase)
        var collection = db.collection(MongoDBCharacterCollection);

        app.post('/save', bodyParser.json(), function (req, res) {
            var query = req.body;
            query._id = query.id;

            collection.findOneAndReplace({ _id: query._id }, query, { upsert: true, returnNewDocument: true }, function (err, result) {
                if (err) throw err;

                res.send(result);
            })
        })

        app.get('/list', cors(), function (req, res) {
            collection.find().toArray(function (err, result) {
                if (err) throw err;

                res.send(result)
            })
        })

        app.get('/load/:query', cors(), function (req, res) {
            var query = req.params.query;
            collection.findOne({ 'id': query }, function (err, result) {
                if (err) throw err;

                res.send(result)
            })
        })

        app.get('/delete/:query', cors(), function (req, res) {
            var query = req.params.query;
            collection.findOneAndDelete({ 'id': query }, function (err, result) {
                if (err) throw err;

                res.send(result)
            })
        })

    })

    var httpServer = http.createServer(app)
    httpServer.listen(HTTPPort, () => {
        console.log('HTTP connector listening on port ' + HTTPPort)
    })

    if (SSLCertificatePath && SSLPrivateKeyPath) {
        try {
            var certificate = fs.readFileSync(SSLCertificatePath, 'utf8');
        } catch (err) {
            console.log('SSL certificate not found at ' + SSLCertificatePath)
            certificate = "";
        }
        try {
            var privateKey = fs.readFileSync(SSLPrivateKeyPath, 'utf8');
        } catch (err) {
            console.log('SSL private key not found at ' + SSLPrivateKeyPath)
            privateKey = "";
        }
        if (certificate && privateKey) {
            var credentials = { key: privateKey, cert: certificate };
            var httpsServer = https.createServer(credentials, app);
            httpsServer.listen(HTTPSPort, () => {
                console.log('HTTPS connector listening on port ' + HTTPSPort)
            })
        } else {
            console.log('HTTPS connector was not started.')
        }

    } else if (SSLCertificatePath || SSLPrivateKeyPath) {
        console.log('SSL information missing from config.json: ')
        if (!SSLCertificatePath) {
            console.log(' SSLCertificatePath');
        }
        if (!SSLPrivateKeyPath) {
            console.log(' SSLPrivateKeyPath');
        }
        console.log('HTTPS connector was not started.')
    }

} else {
    console.log('Database information missing from config.json: ')
    if (!MongoDBConnectionURL) {
        console.log(' MongoDBConnectionURL');
    }
    if (!MongoDBDatabase) {
        console.log(' MongoDBDatabase');
    }
    if (!MongoDBCharacterCollection) {
        console.log(' MongoDBCharacterCollection');
    }
    console.log('Connector cannot be started.')
}