const express = require("express");
const {check, validationResult} = require("express-validator");
const mongoose = require("mongoose");
const config = require("config");
const axios = require("axios").default;
const profileModel = require("../../models/ProfileModel");
const userModel = require("../../models/UserModel");
const postModel = require("../../models/PostModel");
const auth = require("../../middleware/auth");
const { updateOne } = require("../../models/PostModel");
const router = express.Router();

// for testing
router.get("/me", auth, async (req, res) => {
   try {
      const foundUser = await profileModel.findOne({user: req.user.id}).populate("user", ["name", "avatar"]);

      if(!foundUser) {
         return res.status(400).json({msg: "There is no profile for this user"});
      }

   }catch(err) {
      res.status(500).send("Server Error");
   }

}); 

// Create or update a profile in DB
router.post("/", [auth, 
   [
      check("status", "Status is required").notEmpty(),
      check("skills", "Skills is required").notEmpty(),
   ]
], async (req, res) => {
   const errors = validationResult(req);  //validation result contains an array

   if(!errors.isEmpty()) {     
      return res.status(400).json({errors: errors.array()});
   }

   const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
   } = req.body;

   const profileFields = {};  // obj used to create a profile in DB
   profileFields.user = req.user.id;
   if(company) profileFields.company = company;
   if(website) profileFields.website = website;
   if(location) profileFields.location = location;
   if(bio) profileFields.bio = bio;
   if(status) profileFields.status = status;
   if(githubusername) profileFields.githubusername = githubusername;
   if(skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());  // turn each skill into single array
   }

   profileFields.social = {};
   if(youtube) profileFields.social.youtube = youtube;
   if(facebook) profileFields.social.facebook = facebook;
   if(twitter) profileFields.social.twitter = twitter;
   if(instagram) profileFields.social.instagram = instagram;
   if(linkedin) profileFields.social.linkedin = linkedin;

   try {
      const foundUser = await profileModel.findOne({user: req.user.id});

      if(!foundUser) {
         const newProfile = new profileModel(profileFields);

         await newProfile.save();
      }
      const profile = await profileModel.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true});

      return res.json({profile});
   }catch(err) {
      res.status(500).send("Server Error");
   }
   
});

// Get all users' profile
router.get("/", async (req, res) => {
   try {
      const foundUser = await profileModel.find().populate("user", ["name", "avatar"]); // return an array of all users

   } catch (error) {
      res.status(500).send("Server Error");
   }
});

// Get the specified user's profile
router.get("/user/:user_id", async (req, res) => {
   try {
      const foundProfile = await profileModel.findOne({user: req.params.user_id}).populate("user", ["name", "avatar"]);

      if(!foundProfile) {
         return res.status(404).json({msg: "Profile not found"});
      }

      res.send(foundProfile);
   }catch(err) {
      if(err.kind === "ObjectId") {
         return res.status(404).json({msg: "Profile not found"});
      }
      res.status(500).send("Server Error");
   } 
});

// Detele profile and user 
router.delete("/", auth, async (req, res) => {
   try {
      await profileModel.findOneAndRemove({user: req.user.id});
      await userModel.findOneAndRemove({_id: req.user.id});
      await postModel.deleteMany({user: req.user.id});

   } catch (error) {
      res.status(500).send("Server Error");
   }
});

// Update job experience from empty array
router.put("/experience", [auth, 
   [
      check("title", "Title is required").notEmpty(),
      check("company", "Company is required").notEmpty(),
      check("from", "Starting date is required").notEmpty()
   ]
], async (req, res) => {
   const errors = validationResult(req);

   if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
   }

   const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
   } = req.body;

   try {
      const foundProfile = await profileModel.findOne({user: req.user.id});

      foundProfile.experience.unshift({
         title,
         company,
         location,
         from,
         to,
         current,
         description
      });

      await foundProfile.save();

   } catch (err) {
      res.status(500).send("Server Error");
   }

});

// Delete a job experience 
router.delete("/experience/:exp_id", auth, async (req, res) => {
   try {
      const foundProfile = await profileModel.findOne({user: req.user.id});

      // mongoose give us a choice where _id / id both OK
      const removeIndex =  foundProfile.experience.map(val => val.id).indexOf(req.params.exp_id); 
      foundProfile.experience.splice(removeIndex, 1);

      await foundProfile.save();
 
   }catch(err) {
      res.status(500).send("Server Error");
   } 
});

// Update education history from empty array
router.put("/education", [auth, 
   [
      check("school", "School is required").notEmpty(),
      check("degree", "Degree is required").notEmpty(),
      check("fieldofstudy", "Field of study is required").notEmpty(),
      check("from", "Starting date is required").notEmpty()
   ]
], async (req, res) => {
   const errors = validationResult(req);

   if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
   }

   const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
   } = req.body;

   try {
      const foundProfile = await profileModel.findOne({user: req.user.id});

      foundProfile.education.unshift({
         school,
         degree,
         fieldofstudy,
         from,
         to,
         current,
         description
      });

      await foundProfile.save();

   }catch(err) {
      res.status(500).send("Server Error");
   }

});

// Delete education history
router.delete("/education/:edu_id", auth, async (req, res) => {
   try {
      const foundProfile = await profileModel.findOne({user: req.user.id});

      const removeIndex = foundProfile.education.map(val => val.id).indexOf(req.params.edu_id);
      foundProfile.education.splice(removeIndex, 1);
      
      await foundProfile.save();

   }catch(err) {
      res.status(500).send("Server Error");
   }

});

// Get Github info from request to api
router.get("/github/:username", async (req, res) => {
   try {
      const url = `https://api.github.com/users/${req.params.username}/repos?per_page=5&ort=created:asc`;

      const githubRes = await axios.get(url);

      if(githubRes.status !== 200) {
         return res.status(404).json({msg: "No Github repository found!"});
      }

   }catch(err) {
      res.status(500).send("Server Error");
   }
});

module.exports = router;