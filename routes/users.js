const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//Update user
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                console.log("Error:", error);
                res.status(500).json({
                    message: "Oops an error occurred, please try again!"
                });
            }
            try {
                const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
                res.status(200).json({
                    message: "Account updated"
                });
            } catch (error) {
                console.log("Error:", error);
                res.status(500).json({
                    message: "Oops an error occurred, please try again!"
                });
            }
        } else {
            res.status(403).json({
                message: "You can update only your account!"
            });
        }
    }
});

//Delete a user
router.delete("/:id", async(req, res) => {
    console.log("--------delete user--------------------", req.body.userId, req.params.id);
    if(req.body.userId === req.params.id || req.body.isAdmin) {         
        try {
            const deleteUser = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: "Account deleted!"
            });
        } catch (error) {
            console.log("Error:", error);
            res.status(500).json({
                message: "Oops an error occurred, please try again!"
            });
        }
    } else {
        res.status(403).json({
            message: "You can update only your account!"
        });
    }    
});

//Get a user

//Follow user
router.put("/:id/follow", async(req, res) => {
    console.log("--------follow user--------------------", req.body.userId, req.params.id);
    if(req.body.userId === req.params.id) {         
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: {followers: req.body.userId}});
                await currentUser.updateOne({ $push: {followings: req.body.userId}});
                res.status(200).json({
                    message: "User followed!"
                });
            } else {
                res.status(403).json({
                    message: "Already follow this user!"
                });
            }
        } catch (error) {
            console.log("Error:", error);
            res.status(500).json({
                message: "Oops an error occurred, please try again!"
            });
        }
    } else {
        res.status(403).json({
            message: "You can't follow yourself!"
        });
    }    
});

//Unfollowing user
router.put("/:id/unfollow", async(req, res) => {
    console.log("--------unfollow user--------------------", req.body.userId, req.params.id);
    if(req.body.userId === req.params.id) {         
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: {followers: req.body.userId}});
                await currentUser.updateOne({ $pull: {followings: req.body.userId}});
                res.status(200).json({
                    message: "User unfollowed!"
                });
            } else {
                res.status(403).json({
                    message: "Already unfollow this user!"
                });
            }
        } catch (error) {
            console.log("Error:", error);
            res.status(500).json({
                message: "Oops an error occurred, please try again!"
            });
        }
    } else {
        res.status(403).json({
            message: "You can't unfollow yourself!"
        });
    }    
});

module.exports = router;