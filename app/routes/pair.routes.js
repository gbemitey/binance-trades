module.exports = app => {
    const pairs = require("../controllers/pair.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", pairs.create);

    // Update a Tutorial with id
    router.put("/:id", pairs.update);

    // Delete a Tutorial with id
    router.delete("/:id", pairs.delete);

    // Update a new Tutorial
    router.post("/update", pairs.update_post);

    // Delete a new Tutorial
    router.post("/delete", pairs.delete_post);


    app.use('/api/pairs', router);
};