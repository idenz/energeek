const express = require('express');
const controller = require('./auth.controller');

const router = express.Router();

router
  .route('/login')
  .post(controller.login);

module.exports = router;