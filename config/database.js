const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(`mongodb://localhost:27017/Devtinder`)
}


module.exports = connectDB