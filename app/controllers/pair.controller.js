const https = require('https');
const db = require("../models");
const Pair = db.pair;

// Create and Save a new Tutorial
exports.create = (req, res) => {

    // Validate request
    if (!req.body.transactionID) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Tutorial
    const pair = new Pair({
        transactionID: req.body.transactionID,
        pairs: req.body.pairs,
        price: req.body.price,
        transaction: req.body.transactionType,
        channelID: req.body.channelID,
        messageID: req.body.messageID,
    });

    // Save Tutorial in the database
    pair
        .save(pair)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Pair."
            });
        });

};

// Update Pair
exports.update_post = (req, res) => {

    // Validate request
    if (!req.body.transactionID) {
        res.status(400).send({ message: "TransactionID is missing!" });
        return;
    }
    var query = { transactionID: req.body.transactionID };
    const update = { $set: req.body };
    Pair.updateOne(query, update)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `TransactionID was not found!`
                });
            } else
                res.send({ message: "Pair was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Pair"
            });
        });

};


// Create and Save a new Tutorial
exports.delete_post = (req, res) => {

    // Validate request
    if (!req.body.transactionID) {
        res.status(400).send({ message: "TransactionID is missing!" });
        return;
    }
    var transactionID = { transactionID: req.body.transactionID };
    Pair.deleteOne(transactionID)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Pair, Pair was not found!`
                });
            } else {
                var url = 'https://www.tonoit.com/serviceprovider/deleteDiscordSignal/&channel=' + req.body.channelID + '&message=' + req.body.messageID;
                https.get(url, res => {}).on('error', err => {});
                res.send({
                    message: "Pair was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Pair"
            });
        });

};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {

};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    var query = { transactionID: id };

    const update = { $set: req.body };

    Pair.updateOne(query, update)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Pair with id=${id}. Maybe Pair was not found!`
                });
            } else
                res.send({ message: "Pair was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Pair with id=" + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    var transactionID = { transactionID: id };
    Pair.remove(transactionID)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Pair with id=${id}. Maybe Pair was not found!`
                });
            } else {
                res.send({
                    message: "Pair was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Pair with id=" + id
            });
        });
};

// Delete all Tutorials from the database.

// FIND ALL
exports.findAll = (res) => {

    Pair.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};