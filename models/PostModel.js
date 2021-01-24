const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
   user: {
      type: mongoose.Types.ObjectId,
      ref: "user"
   },
   text: {
      type: String,
      require: true
   },
   name: {
      type: String
   },
   avatar: {
      type: String
   },
   likes: [       // Number of like is represented by array of identical users
      {  
         user: {
            type: mongoose.Types.ObjectId,
            ref: "user"
         }
      }
   ],
   comments: [    // Comments are represented by array of identical users and their text
      {
         user: {
            type: mongoose.Types.ObjectId,
            ref: "user"
         },
         name: {
            type: String
         },
         avatar: {
            type: String
         },
         text: {
            type: String,
            require: true
         },
         date: {
            type: Date,
            default: Date.now
         }
      }
   ],
   date: {
      type: Date,
      default: Date.now
   }  
});

module.exports = mongoose.model("post", postSchema);