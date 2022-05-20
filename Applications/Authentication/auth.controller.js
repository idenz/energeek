/**
 * Auth Controller
 */
 const bcrypt = require("bcryptjs");
 const jwt = require("jsonwebtoken");
 const { secret } = require("../../Helpers/config.helper");
 const errorHandler = require("../../Utils/errorController");
 const UserServices = require("../UserManagement/User/user.service");
 
 module.exports = {
   /**
    *
    * @param req { username, password }
    * @param res
    * @param next
    * @returns { Status [200: (Object) Jwt Token, 401: (String) Unathorized]}
    */
   login: async function (req, res, next) {
     errors = {};
     const email = req.body.email;
     const password = req.body.password;
     const user = await UserServices.getByEmail(email)
 
     if (!user) {
       return errorHandler({ statusCode: 401, isOperational: true, message: "Can't found your credential" }, req, res);
     }
 
     var match = await bcrypt.compare(password, user.password);
     if (match) {
       const payload = {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
       };
 
       jwt.sign(payload, secret, { expiresIn: "6h" }, (err, token) => {
         if (err)
           return res.status(500).json({
             error: "Error signing token",
             raw: err,
           });
 
         console.log("Login success!");
         res.json({
           success: true,
           token: `${token}`,
           items: {
             _id: user._id,
             first_name: user.first_name,
             last_name: user.last_name,
             username: user.username,
             role: user.role,
             idUnit: user.unit,
           },
         });
       });
     } else {
       return errorHandler({ statusCode: 401, isOperational: true, message: "Can't found your credential" }, req, res);
     }
   },
 };
 