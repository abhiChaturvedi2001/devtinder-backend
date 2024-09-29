const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userModel = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        // ins string casae therer were max length and min length
    },
    lastName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not valid`
        },
        //  custome validate function
        // this validate function is only run when the new object is created 
        // this is not running for exisiting ones for explicitly allow using {runValidators:true}
        validate(value) {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gender is not valid")
            }
        },
    }
}, { timestamps: true })


userModel.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "devtinder@1234", {
        expiresIn: "5h"
    });

    return token;
}

userModel.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHas = user.password

    const isPasswordMatch = await bcrypt.compare(passwordInputByUser, passwordHas);
    return isPasswordMatch;
}


const User = mongoose.model("User", userModel);
module.exports = User;