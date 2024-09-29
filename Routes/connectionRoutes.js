const express = require("express");
const auth = require("../middleware/auth");
const connectionSchema = require("../models/connectionSchema");
const User = require("../models/user");
const router = express.Router();

// this api is for sending the or ingnored the user 
router.post("/request/send/:status/:touserID", auth, async (req, res) => {
    try {
        // jo request bhej raha hoga woh user already log in hoga 
        // toh uski id mhuje chayie first
        const senderUser = req.user._id;
        const recieverUser = req.params.touserID
        const status = req.params.status

        // Always secure your api by implementing small small checks
        // checking if user put ignored or interested then hit apu else giving the error message
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Bad Request type",
                success: false
            })
        }

        // if there is existing request means
        // ek bari sent kr di toh dobara na kr paaye toh woh check krna hoga
        const checkExistingRequest = await connectionSchema.findOne({
            $or: [
                { senderUser, recieverUser },
                { senderUser: recieverUser, recieverUser: senderUser }
            ],
        })

        if (checkExistingRequest) {
            return res.status(400).json({
                message: "Request sent already",
                success: false
            })
        }

        // checking the fake user is not present or not 
        const checkingToUserId = await User.findById(recieverUser);
        if (!checkingToUserId) {
            return res.status(400).json({
                message: "user not found",
                success: false
            })
        }

        // user can't send your self
        if (recieverUser == senderUser) {
            return res.status(400).json({
                message: "you can't send the request",
                success: false
            })
        }

        const connectionRequest = new connectionSchema({ senderUser, recieverUser, status });
        const data = await connectionRequest.save();


        return res.status(200).json({
            message: "Request Sent Successfully",
            success: true,
            data
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
        })
    }
})

// after the sending requrest we need to accept or cancel it so this api for it
router.post("/request/review/:status/:requestID", auth, (req, res) => {
    try {
        const status = req.params.status;
        const requestID = req.params.requestID;
    } catch (error) {

    }
})

module.exports = router