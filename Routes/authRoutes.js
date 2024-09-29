const express = require("express");
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcrypt")
const auth = require("../middleware/auth");

// register endpoints
router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, age, gender } = req.body
        const userExist = await User.findOne({ emailId });
        if (userExist) {
            return res.status(200).json({
                message: "Account already exist please use different credentials to create a new account",
                success: false
            })
        }
        const newUser = new User({ firstName, lastName, emailId, age, password, gender });
        const hashpassword = await bcrypt.hash(password, 12);
        newUser.password = hashpassword;
        await newUser.save();

        return res.status(200).json({
            message: "User Created Successfully",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
})

// LOGIN endpoints
router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // check email is valid or not
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).json({
                message: "email / password are not valid",
                success: false
            })
        }
        const isPasswordMatch = await user.validatePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "email / password are not valid",
                success: false
            })
        }
        // if both are correct
        const token = await user.getJWT();
        res.cookie("token", token);
        return res.status(200).json({
            message: "Logged in SuccessFully",
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
})

// Logout
router.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })

        return res.status(200).json({
            message: "Logged Out SuccessFully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
})

// get profile
router.get("/profile", auth, async (req, res) => {
    try {
        const user = req.user
        return res.status(200).json({
            user,
            message: "profile fetch successfully",
            success: true
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false
        })
    }
})

router.patch("/update/:id", async (req, res) => {
    // if you want not allow to update email id then doing smomethin
    try {
        const id = req.params.id;
        const data = req.body
        // use object.key() //method 
        // when we are doing update just pass id and data along with 
        // is Allowed updates is helps to limit the user to update the email id  
        const allowedUpdates = ["firstName", "lastName", "password", "gender", "age"];
        const isAllowedUpdates = Object.keys(data).every((k) => allowedUpdates.includes(k));
        if (!isAllowedUpdates) {
            throw new Error("Update not Allowed")
        }
        const user = await User.findByIdAndUpdate(id, data, { runValidators: true });
        return res.status(200).json({
            message: "data update successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: true
        })
    }
})

router.get("/feed", auth, async (req, res) => {
    try {
        const getAllUser = await User.find();
        return res.status(200).json({
            getAllUser
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: true
        })
    }
})
module.exports = router;