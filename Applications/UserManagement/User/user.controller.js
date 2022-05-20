/**
 *
 * Users Controller
 */

const errorHandler = require('../../../Utils/errorController');
const UserServices = require('./user.service')

module.exports = {

    create: async function (req, res, next) {

        let user = await UserServices.create(req.body)
    
        if(user === "exists") return errorHandler({ statusCode: 400, isOperational: true, message: "Email has been register"}, req, res);
        if(!user) return errorHandler({ statusCode: 400, isOperational: true, message: "Register Failed"}, req, res);
    
        res.status(200).json({
            status: 'success',
            items : user
        });
    
    },

    getProfile: async function(req, res, next) {
        
        let result = await UserServices.getByEmail(req.user.email)
        if(!result) return errorHandler({ statusCode: 400, isOperational: true, message: "No document found with that ID"}, req, res);

        res.status(200).json({
            status: 'success',
            items : result
        });

    },

    getAll: async function (req, res, next) {

        /** Page & Limit */
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1)*limit;

        let ccount = await UserServices.getTotalItem();
        let result = await UserServices.getAll({}, skip, limit);
        
        res.status(200).json({
            status: 'success',
            totalItem: ccount,
            items : result
        });

    },

    getById: async function (req, res, next) {

        let result = await UserServices.getById(req.params.id)
        if(!result) return errorHandler({ statusCode: 400, isOperational: true, message: "No document found with that ID"}, req, res);

        res.status(200).json({
            status: 'success',
            items : result
        });

    },

    update: async function (req, res, next) {

        const filter = { where: { id: req.user.id } }

        let result = await UserServices.update(filter, req.body)
        if(!result) return errorHandler({ statusCode: 400, isOperational: true, message: "Failed update data"}, req, res);

        res.status(200).json({
            status: 'success',
            items : result
        });

    },

    delete: async function (req, res, next) {

        let result = await UserServices.delete({ id: req.params.id})
        if (!result) return errorHandler({ statusCode: 400, isOperational: true, message: "Failed delete data"}, req, res);

        res.status(200).json({
            status: 'success',
            message: 'Delete user success'
        });

    },

}