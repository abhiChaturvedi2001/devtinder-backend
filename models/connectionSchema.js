const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    senderUser: {
        // when we deal with the id in mongo db then just write like this
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    recieverUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["accepted", "rejected", "ignored", "interested"],
            message: `{VALUE} is not valid `
        },
        required: true
    }

}, { timestamps: true })

// this is a middleware
// checking the your are not sent the request yourself
connectionSchema.index({ senderUser: 1, recieverUser: 1 }),
    connectionSchema.pre("save", function () {
        const request = this;
        if (request.senderUser.equals(request.recieverUser)) {
            throw new Error("cannot send request to yourself!")
        }
        next();
    })

module.exports = mongoose.model("ConnectionsRequest", connectionSchema);


