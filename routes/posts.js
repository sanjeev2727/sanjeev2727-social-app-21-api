const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//Create post
router.post("/", async(req, res, next) => {
    console.log("--------Create post--------------------");
    const newPost = new Post(req.body);

    try {
        const createdPost = await newPost.save();
        if(createdPost) {
            res.status(201).json({
                message: "Post created!"
            });
        }
        res.status(403).json({
            message: "Post could not created!"
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Oops an error occurred, please try again!"
        });
    }
});

//Update post
router.put("/:id", async(req, res) => {
    console.log("--------Update post--------------------", req.params.id, req.body.userId);
    try {
        const existingPost = await Post.findById(req.params.id);
        if(existingPost.userId === req.body.userId) {
            await existingPost.updateOne({$set: req.body});
            return res.status(200).json({
                message: "Post updated!"
            });
        } else {
            return res.status(403).json({
                message: "Can't update post!"
            });
        }
        
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Oops an error occurred, please try again!"
        });
    }
});

//Delete Post
router.delete("/:id", async(req, res) => {
    console.log("--------Delete post--------------------", req.params.id, req.body.userId);
    try {
        const existingPost = await Post.findById(req.params.id);
        if(existingPost.userId === req.body.userId) {
            await existingPost.deleteOne();
            return res.status(200).json({
                message: "Post deleted!"
            });
        } else {
            return res.status(403).json({
                message: "Can't delete post!"
            });
        }
        
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Oops an error occurred, please try again!"
        });
    }
});
//Like Post
router.put("/:id/like", async(req, res) => {
    console.log("--------Like post--------------------", req.params.id, );
    try {
        const existingPost = await Post.findById(req.params.id);
        if(!existingPost.likes.includes(req.body.userId)) {
            await existingPost.updateOne({$push: {likes: req.body.userId}});
            return res.status(200).json({
                message: "Post liked!"
            });
        } else {
            await existingPost.updateOne({$pull: {likes: req.body.userId}});
            return res.status(200).json({
                message: "Post unliked!"
            });
        }
        
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Oops an error occurred, please try again!"
        });
    }
});

//Get a post
router.get("/:id", async(req, res) => {
    console.log("--------Like post--------------------", req.params.id, );
    try {
        const existingPost = await Post.findById(req.params.id);        
        return res.status(200).json({
            message: "success!",
            data: existingPost
        });        
        
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Oops an error occurred, please try again!"
        });
    }
});

//Get timeline posts
router.get("/timeline/all", async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.findById({userId: currentUser._id});
        const friendPosts = await Promise.all(
           currentUser.following.map(friendId => {
               Post.find({ userId: friendId });
           })
        );

       return res.status(200).json({
        message: "Posts found!",
        data: userPosts.concat(...friendPosts),
      });
        
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: "Oops an error occurred, please try again!"
        });
    }
});

module.exports = router;