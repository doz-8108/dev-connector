const jwt = require("jsonwebtoken");
const config = require("config");

/*The middleware is used to turn back the jwted payload(contains id) back to a obj
 origin ==> const payload = { 
                     user: {
                        id: user.id;  (id from the instance of saved model)
                     }
            }
*/
module.exports = (req, res, next) => {
   const token = req.header("x-auth-token"); // The header may contain the token

   if(!token) {
      return res.status(401).json({msg: "No token, authorization denied"});
   }

   try {
      const decoded = jwt.verify(token, config.get("jwtSecret"));

      req.user = decoded.user;
      next();
   }catch(err) {
      res.status(401).json({msg: "Token is not valid"});
   }
}