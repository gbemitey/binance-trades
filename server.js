const express = require("express");
const cors = require("cors");

const app = express();

const WebSocket = require('ws');

const ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

var corsOptions = {
    origin: "https://tonoit-binance-trades.herokuapp.com/"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const https = require('https');

//Connect to DB
const db = require("./app/models");
const Pair = db.pair;
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
        /*
        Pair.updateOne({ transactionID: 58 }, { $set: { messageID: 1 } }, { upsert: true }).then((result, err) => {
            console.log("Value Updated");
        })*/

        ws.on('message', function incoming(data) {

            const parseJsonAsync = (data) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(JSON.parse(data))
                    })
                })
            }

            parseJsonAsync(data).then(jsonData => {
                Pair.find()
                    .then(result => {
                        const dbDatas = result;
                        //console.log(dbDatas);
                        for (const dbData in dbDatas) {
                            jsonData.map(function(person) {
                                var p = dbDatas[dbData].pairs;
                                p = p.replace("/", "");
                                if (person.s == p && person.c <= dbDatas[dbData].price && dbDatas[dbData].transaction.toLowerCase() == "buy") {

                                    var transactionID = { transactionID: dbDatas[dbData].transactionID };
                                    Pair.deleteOne(transactionID)
                                        .then(data => {
                                            if (!data) {

                                            } else {
                                                // console.log(dbDatas[dbData].transactionID);
                                                var url = 'https://www.tonoit.com/serviceprovider/signalwebhook/&id=' + dbDatas[dbData].transactionID + '&price=' + dbDatas[dbData].price + '&trade_pair=' + dbDatas[dbData].pairs;
                                                https.get(url, res => {
                                                    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
                                                }).on('error', err => {
                                                    // console.log('Error: ', err.message);
                                                });

                                                var url2 = 'https://www.tonoit.com/serviceprovider/deleteDiscordSignal/&channel=' + req.body.channelID + '&message=' + req.body.messageID;
                                                https.get(url2, res => {}).on('error', err => {});

                                            }
                                        })
                                }

                                if (person.s == p && person.c >= dbDatas[dbData].price && dbDatas[dbData].transaction.toLowerCase() == "sell") {

                                    var transactionID = { transactionID: dbDatas[dbData].transactionID };
                                    Pair.deleteOne(transactionID)
                                        .then(data => {
                                            if (!data) {

                                            } else {
                                                // console.log(dbDatas[dbData].transactionID);
                                                var url = 'https://www.tonoit.com/serviceprovider/signalwebhook/&id=' + dbDatas[dbData].transactionID + '&price=' + dbDatas[dbData].price + '&trade_pair=' + dbDatas[dbData].pairs;
                                                https.get(url, res => {
                                                    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
                                                }).on('error', err => {
                                                    // console.log('Error: ', err.message);
                                                });
                                                var url2 = 'https://www.tonoit.com/serviceprovider/deleteDiscordSignal/&channel=' + req.body.channelID + '&message=' + req.body.messageID;
                                                https.get(url2, res => {}).on('error', err => {});

                                            }
                                        })
                                }
                            });
                        }
                    })
                    .catch(err => {
                        return 'error';

                    });


            })

        });

    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });


// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Tonoit Binance." });
});

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function isObject(objValue) {
    return objValue && typeof objValue === 'object' && objValue.constructor === Object;
}

// set port, listen for requests

require("./app/routes/pair.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);

});