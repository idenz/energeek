/**
 *
 * Unit Router
 */

const express = require('express');
const passport = require('passport');

const router = express.Router();
const middleware = require('../../../Middleware/role.middleware')
const upload = require('../../../Middleware/upload.middleware')
const controller = require('./user.controller')

router
    .get('/', [passport.authenticate('jwt', { session: false }), middleware.isAdmin], controller.getAll)
    .post('/', controller.create);

router
    .get('/profile', [passport.authenticate('jwt', { session: false })], controller.getProfile)

router
    .patch('/profile', [passport.authenticate('jwt', {session: false}) ], controller.update); // only admin can edit user

router
    .delete('/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.delete) // only admin can delete user

module.exports = router;