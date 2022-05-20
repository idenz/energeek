const jwt = require("jsonwebtoken");
const UserServices= require("../Applications/UserManagement/User/user.service")
const { secret } = require("../Helpers/config.helper");
const errorHandler = require("../Utils/errorController");

const filter = (arr) => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "access denied" });
    } else {
      const decoded = jwt.verify(token, secret);

      if (!decoded) {
        return errorHandler({ statusCode: 400, isOperational: true, message: "Invalid user" }, req, res);
      }

      let data = [];
      for (let i = 0; i < arr.length; i++) {
        if (decoded.role == arr[i] || arr[i] == "all") {
          data.push(true);
        } else {
          data.push(false);
        }
      }

      const filterTrue = data.indexOf(true) > -1;

      if (filterTrue) {
        return next();
      } else {
        return errorHandler({ statusCode: 400, isOperational: true, message: "midd unauthorized" }, req, res);
      }
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error, req, res);
  }
};

exports.isAdmin = filter(["admin"]);
exports.isAll = filter(["all"]);