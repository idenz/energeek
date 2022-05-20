/**
 *
 * Resource Router
 */

const express = require('express');
const passport = require('passport');

const router = express.Router();
const middleware = require('../../Middleware/role.middleware')
const upload = require('../../Middleware/upload.middleware')
const controller = require('./product.controller')

router
    .get('/', [passport.authenticate('jwt', { session: false }) ], controller.getAll)
    .post('/', [passport.authenticate('jwt', { session: false }) ], controller.create);

router
    .get('/:id', [passport.authenticate('jwt', {session: false})], controller.getById)
    .patch('/:id', [passport.authenticate('jwt', {session: false}), ], controller.update); // only admin can edit user

router
    .delete('/:id', [passport.authenticate('jwt', {session: false}) ], controller.delete) // only admin can delete user

module.exports = router;