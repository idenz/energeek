/**
 *
 * @type {Application}
 */

//
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
require("./../passportconfig")(passport);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const auth = require("./Authentication/auth.router")
const userManagement = require("./UserManagement/")
const product = require("./Product/product.router")
const transaction = require("./Transactions/transactions.router")

// Cors
app.use(cors());

//route
app.use("/test", (req, res, next) => {
  res.send(`<h1>Connected to server</h1>`);
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/upload/images/', express.static('./Uploads/images'))
app.use('/asset/images/', express.static('./Assets/images'))

// Auth
app.use('/api/auth', auth)

// User Management
app.use('/api/user-management/user', userManagement.user)

// Products
app.use('/api/product', product)

// Transaction
app.use('/api/transaction', transaction)

module.exports = app;