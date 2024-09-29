const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database")
const authRoutes = require("./Routes/authRoutes")
const connectionRoutes = require("./Routes/connectionRoutes")
const cookieParser = require('cookie-parser')
const cors = require("cors");
const app = express();

// middlweare and config are comes under this 
dotenv.config();
const options = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(options));
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 4000;
app.use("/", authRoutes);
app.use("/", connectionRoutes);


// connection database and listerning port 
connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
        console.log("serve is listen ", port);
    })
}).catch((error) => {
    console.log(error.message);
})


