const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const userModel = require("../../models/UserModel");

// Users Registration
router.post("/",  
[  // Use express-validator to check the input (req.body) in json
   check("name", "Name is required").notEmpty(),   
   check("email", "Please include a valid email").isEmail(),
   check("password", "Please enter a password with 6 or more characters").isLength({min: 6})
], async (req, res) => {
   const error = validationResult(req);   // Get the validated result

   if(!error.isEmpty()) {  // If validation failed #return is crucial!
      return res.status(400).json({errors: error.array()});
   }

   const {name, email, password} = req.body; // Continue if succeed

   try {
      const foundUser = await userModel.findOne({email});  // await needed if contact made to cloud database

      if(foundUser) {   // Check whether use exists
         return res.status(400).json({msg: "User already exists"});
      }

      const avatar = gravatar.url(email, {   // Get their photo
         size: "200",
         rating: "pg",
         default: "mp"
      });

      const user = new userModel({  // Create a new user in collection
         name,
         email,
         avatar,
         password: await bcrypt.hash(password, 10)
      });

      await user.save();   // await till the user is saved then notify

      const payload = {    // !!mongoose help us to get rid of the underscore of id
         user: {
            id: user.id
         }
      };

      jwt.sign(payload,   // Generate the key jwt.sign(payload, secretkey, options, callback);
         config.get("jwtSecret"), 
         {expiresIn: 360000},
         (err, token) => {
            if(err) throw err;
            res.json({token});   
         }
      );
      
   }catch(err) {
      res.status(500).send("Server error");
   }
});

module.exports = router; 