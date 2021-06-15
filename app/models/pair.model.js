module.exports = mongoose => {
    var schema = mongoose.Schema({
        transactionID: String,
        pairs: String,
        price: Number,
        transaction: String,
        channelID: String,
        messageID: String
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Pair = mongoose.model("tutorial", schema);
    return Pair;
};