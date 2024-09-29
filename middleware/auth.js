const jwt = require("jsonwebtoken");
const User = require("../models/user")

const auth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        console.log(token);
        if (!token) {
            return res.status(400).json({
                message: "Unauthroized access",
                success: false
            })
        }

        const decodeMessage = await jwt.verify(token, "devtinder@1234");
        if (!decodeMessage) {
            return res.status(400).json({
                message: "token is not valid",
                success: false
            })
        }

        const { _id } = decodeMessage;
        const user = await User.findOne({ _id: _id });
        req.user = user
        next();
    } catch (error) {

    }
}

module.exports = auth
