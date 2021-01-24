const express = require("express");
const postModel = require("../../models/PostModel");
const userModel = require("../../models/UserModel");
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");
const PostModel = require("../../models/PostModel");
const router = express.Router();

// Post new content
router.post("/", [auth, 
   [
      check("text", "Content is required!").notEmpty()
   ]
], async (req, res) => {
   const errors = validationResult(req);

   if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
   }

   try {
      const foundUser = await userModel.findById(req.user.id).select("-password");

      const newPost = new postModel({
         user: foundUser.id,
         text: req.body.text,
         name: foundUser.name,
         avatar: foundUser.avatar
      });

      await newPost.save();

      res.json(await postModel.find());

   } catch (err) {
      res.status(500).send("Server Error");
   }
});

// Get all posts from latest post
router.get("/", auth, async (req, res) => {
   try {
      const posts = await postModel.find().sort({date: -1});

      res.send(posts);

   } catch (error) {
      req.status(500).send("Server Error");
   }
});

// Get a specified post
router.get("/:post_id", auth, async (req, res) => {
   try {
      const post = await PostModel.findById(req.params.post_id);

      if(!post) {
         return res.status(404).send("Post not found");
      }

      res.send(post);

   } catch (err) {
      if(err.kind === "ObjectId") {
         return res.status(404).send("Post not found");
      }
      res.status(500).send("Server Error");
   }
});  

// Delete a specified post 
router.delete("/:post_id", auth, async (req, res) => {
   try {
      const post  = await postModel.findById(req.params.post_id);
      
      if(post.user.toString() !== req.user.id) {
         return res.status(401).send("Unauthorized Access");
      }

      await post.remove();
      res.send(post);
      
   } catch (err) {
      if(err.kind === "ObjectId") {
         return res.status(404).send("Post not found");
      }
      res.status(500).send("Server Error");
   }
});

// Update the like status (like <=> dislike)
router.put("/like/:post_id", auth, async (req, res) => {
   try {
      const posts = await postModel.findById(req.params.post_id);

      if(!posts.likes.find(like => like.user.toString() === req.user.id)) {
         posts.likes.unshift({user: req.user.id});
      }else {
         const removeIndex = posts.likes.map(like => like.user).indexOf(req.user.id);
         posts.likes.splice(removeIndex, 1);
      }

      await posts.save();
      res.send(posts.likes);

   } catch (err) {
      res.status(500).send("Server Error");
   }
});

// Post a comment under a post
router.post("/comment/:post_id", [auth, 
   [
      check("text", "Content is required").notEmpty()
   ]
], async (req, res) => {
   const errors = validationResult(req);

   if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
   }

   try {
      const user = await userModel.findById(req.user.id);
      const post = await postModel.findById(req.params.post_id);
      
      const newComment = {
         user: req.user.id,
         text: req.body.text,
         name: user.name,
         avatar: user.avatar
      };

      post.comments.unshift(newComment);
      await post.save();

   } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
   }
});

// Delete a comment under a post
router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
   try {
      const post = await postModel.findById(req.params.post_id);
      
      const comment = post.comments.find(comment => comment.id.toString() === req.params.comment_id);

      if(!comment) {
         return res.status(404).send("Comment Not Found");
      }

      if(comment.user.toString() !== req.user.id) {
         return res.status(401).send("Unauthorized Access");
      }

      const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.comment_id);
      post.comments.splice(removeIndex, 1);

      await post.save();

      res.send(post.comments);

   }catch(err) {
      res.status(500).send("Server Error");
   }
});

module.exports = router;