const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        min: 3,
    },
    lastName: {
        type: String,
        min: 3,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String, 
        require: true,
        min: 8,
    },
    profileImage: {
        type: String, 
        default: "",
    },
    coverImage: {
        type: String, 
        default: "",
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,        
    },
    city: {
        type: String,
        max: 50,
    },
    homeTown: {
        type: String,
        max: 50,
    },
    mobile: {
        type: String,
        max: 15,
    },
    country: {
        type: String,
        max: 50,
    },
    state: {
        type: String,
        max: 50,
    },
    relationship: {
        type: Number,
        enum: [1,2,3]
    } 
},
{timestamps: true});

module.exports = mongoose.model("User", UserSchema);