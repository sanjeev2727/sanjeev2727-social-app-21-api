const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//register
router.post("/register", async (req, res) => {
    console.log("--------register--------------------");
   // res.send("hi.... user auth");    

    try {

        //generate hased password
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await new User({
            email: req.body.email,
            password: hasedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });

        await newUser.save();
        res.status(200).json({
            "message": "User created successfully."
        });
    } catch (error) {
        res.status(500).json({
            "message": "Oops an error occurred, please try again!"
        });
    }
});

//login
router.post("/login", async(req, res) => {
    console.log("--------login--------------------", req.body);
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if(!existingUser) {
            res.status(404).json({
                message: "Credential are not valid, please try again!"
            });
        }
        const validPassword = await bcrypt.compare(req.body.password, existingUser.password);
        if(!validPassword) {
            res.status(404).json({
                message: "Credential are not valid, please try again!"
            });
        }
        res.status(200).json({
            message: "User found...!"
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            message: "Oops an error occurred, please try again!"
        });
    }
});

module.exports = router;