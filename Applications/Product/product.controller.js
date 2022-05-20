/**
 *
 * Users Controller
 */

const errorHandler = require('../../Utils/errorController');
const ProductServices = require('./product.service')

module.exports = {

    create: async function (req, res, next) {

        req.body.createdBy = req.user.id;

        let resource = await ProductServices.create(req.body)
        if(!resource) return errorHandler({ statusCode: 400, isOperational: true, message: "Create Failed"}, req, res);
    
        res.status(200).json({
            status: 'success',
            items : resource
        });
    
    },

    getById: async function(req, res, next) {
        
        let result = await ProductServices.getById(req.params.id)
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

        let ccount = await ProductServices.getTotalItem();

        let filter = {}
        let result = await ProductServices.getAll(filter, skip, limit);
        
        res.status(200).json({
            status: 'success',
            totalItem: ccount,
            items : result
        });

    },

    getById: async function (req, res, next) {

        let result = await ProductServices.getById(req.params.id)
        if(!result) return errorHandler({ statusCode: 400, isOperational: true, message: "No document found with that ID"}, req, res);

        res.status(200).json({
            status: 'success',
            items : result
        });

    },

    update: async function (req, res, next) {

        const filter = { where: { id: req.params.id } }

        req.body.updatedBy = req.user.id
        let result = await ProductServices.update(filter, req.body)
        if(!result) return errorHandler({ statusCode: 400, isOperational: true, message: "Failed update data"}, req, res);

        res.status(200).json({
            status: 'success',
            items : result
        });

    },

    delete: async function (req, res, next) {

        let result = await ProductServices.delete({ id: req.params.id })
        if (!result) return errorHandler({ statusCode: 400, isOperational: true, message: "Failed delete data"}, req, res);

        res.status(200).json({
            status: 'success',
            message: "Delete resources success"
        });

    },
}