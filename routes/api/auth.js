const express = require("express");
const {check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const userModel = require("../../models/UserModel");
const auth = require("../../middleware/auth");
const router = express.Router();

//for testing
router.get("/", auth, async (req, res) => { 
   try {
      const foundUser = await userModel.findById(req.user.id).select("-password");

      if(foundUser) 
         res.send(foundUser);

   }catch(err) {
      res.status(404).json({msg: "User not found"});
   }
});

// login auth
router.post("/",
[
   check("email", "Please include a valid email").isEmail(),
   check("password", "Password is required").exists()
], async (req, res) => {
   const error =  validationResult(req);

   if(!error.isEmpty()) {
      return res.status(400).json({msg: "Invalid credential"});
   }

   const {email, password} = req.body;

   try {
      const foundUser = await userModel.findOne({email});

      if(!foundUser) {
         return res.status(400).json({msg: "Invalid credential"});
      }

      const isMatch = await bcrypt.compare(password, foundUser.password);

      if(!isMatch) {
         return res.status(400).json({msg: "Invalid credential"});
      }

      const payload = {
         user: {
            id: foundUser.id
         }
      }

      jwt.sign(
         payload, 
         config.get("jwtSecret"),
         {expiresIn: 360000},
         (err, token) => {
            if(err) throw err;
            res.json({token});
         }
      );

   }catch (err) {
      res.status(400).json({msg: "Invalid credential"});
   }
});

module.exports = router;

