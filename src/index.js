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
var MongoDBMessagesCollection = config.MongoDBMessagesCollection || "";
var SSLCertificatePath = config.SSLCertificatePath || "";
var SSLPrivateKeyPath = config.SSLPrivateKeyPath || "";

var app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if (MongoDBConnectionURL && MongoDBDatabase && MongoDBCharacterCollection && MongoDBMessagesCollection) {
    mongodb.connect(MongoDBConnectionURL, function (err, client) {
        var db = client.db(MongoDBDatabase)
        var characters = db.collection(MongoDBCharacterCollection);
        var messages = db.collection(MongoDBMessagesCollection);

        //Returns all savegames.
        app.get('/listCharacters', cors(), function (req, res) {
            characters.find().toArray(function (err, result) {
                if (err) throw err;

                res.send(result)
            })
        })

        //Returns a savegame by ID.
        app.get('/loadCharacter/:query', cors(), function (req, res) {
            var query = req.params.query;

            characters.findOne({ 'id': query }, function (err, result) {
                if (err) throw err;

                res.send(result)
            })
        })

        //Inserts or overwrites a savegame identified by its MongoDB _id, which is set to its own id.
        app.post('/saveCharacter', bodyParser.json(), function (req, res) {
            var query = req.body;
            query._id = query.id;

            characters.findOneAndReplace({ _id: query._id }, query, { upsert: true, returnNewDocument: true }, function (err, result) {
                if (err) throw err;

                res.send(result);
            })
        })

        //Deletes a savegame by ID.
        app.post('/deleteCharacter', bodyParser.json(), function (req, res) {
            var query = req.body;

            characters.findOneAndDelete({ 'id': query.id }, function (err, result) {
                if (err) throw err;

                res.send(result)
            })
        })

        //Returns the current time in order to timestamp new messages on the frontend.
        app.get('/time', cors(), function (req, res) {
            var time = new Date().getTime();
            res.send({ time: time });
        })

        //Returns all messages addressed to this recipient.
        app.get('/loadMessages/:query', cors(), function (req, res) {
            var query = req.params.query;

            messages.find({ 'recipientId': query }).toArray(function (err, result) {
                if (err) throw err;

                res.send(result)
            })
        })

        //Sends your messages to the database.
        app.post('/saveMessages', bodyParser.json(), function (req, res) {
            var query = req.body;

            messages.insertMany(query, function (err, result) {
                if (err) throw err;

                res.send(result);
            })
        })

        //Deletes one message by id.
        app.post('/deleteMessage', bodyParser.json(), function (req, res) {
            var query = req.body;

            messages.findOneAndDelete({ 'id': query.id }, function (err, result) {
                if (err) throw err;

                res.send(result)
            })
        })

        //Deletes all messages addressed to this recipient that are/aren't turnChange messages.
        app.post('/deleteMyMessages', bodyParser.json(), function (req, res) {
            var query = req.body;

            messages.deleteMany({ 'recipientId': query.recipientId, 'turnChange': query.turnChange }, function (err, result) {
                if (err) throw err;

                res.send(result)
            })
        })

        //Deletes all messages that are older than 10 minutes. The messages are timestamped with the above time to avoid issues arising from time differences.
        app.get('/cleanupMessages', cors(), function (req, res) {
            var tenMinutesOld = new Date();
            tenMinutesOld.setMinutes(tenMinutesOld.getMinutes() - 10);

            messages.deleteMany({ 'timeStamp': { $lt: tenMinutesOld.getTime() } }, function (err, result) {
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
    if (!MongoDBMessagesCollection) {
        console.log(' MongoDBMessagesCollection');
    }
    console.log('Connector cannot be started.')
}