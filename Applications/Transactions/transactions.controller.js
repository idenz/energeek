/**
 *
 * Users Controller
 */

const errorHandler = require('../../Utils/errorController');
const TransactionServices = require('./transactions.service')
const ResourceService = require('../Resource/resource.service');
const ProductService = require('../Product/product.service');

module.exports = {

    create: async function (req, res, next) {

        req.body.createdBy = req.user.id

        let transaction = await TransactionServices.create(req.body)
        
        if(!transaction) return errorHandler({ statusCode: 400, isOperational: true, message: "Create Failed"}, req, res);
        
        req.body.transactionId = transaction.id
        let resource = await ResourceService.create(req.body)

        /**
         * Temporary with this conditional
         * Need Update to session transaction
         */

        if(!resource) {
            await TransactionServices.delete({ id: transaction.id })
            return errorHandler({ statusCode: 400, isOperational: true, message: "Create Failed"}, req, res);
        }

        if(req.body.type.toLowerCase() === 'penambahan'){
            await ProductService.increment(req.body.qty, { id: req.body.productId })
        }else if(req.body.type.toLowerCase() === 'pengurangan'){
            await ProductService.increment( -req.body.qty, { id: req.body.productId })
        }

        res.status(200).json({
            status: 'success',
            items : transaction
        });
    
    },

    getAll: async function (req, res, next) {

        /** Page & Limit */
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1)*limit;

        let ccount = await TransactionServices.getTotalItem();
        let result = await TransactionServices.getAll({}, skip, limit);
        
        res.status(200).json({
            status: 'success',
            totalItem: ccount,
            items : result
        });

    },

    getById: async function (req, res, next) {

        let result = await TransactionServices.getById(req.params.id)
        if(!result) return errorHandler({ statusCode: 400, isOperational: true, message: "No document found with that ID"}, req, res);

        res.status(200).json({
            status: 'success',
            items : result
        });

    },

    delete: async function (req, res, next) {

        let permanent = req.query.permanent === "true" ? true : false

        let result = await TransactionServices.delete(req.params.id, permanent)
        if (!result) return errorHandler({ statusCode: 400, isOperational: true, message: "Failed delete data"}, req, res);

        res.status(200).json({
            status: 'success',
            message: 'Delete transaction success'
        });

    },
}