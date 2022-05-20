/**
 *
 * Products services
 */

const { sequelize } = require('../../Database/sequelize.database');

const ProductModel = require('../../Database/sequelize.database').product
const TransactionModel = require('../../Database/sequelize.database').transaction
const ResourceModel = require('../../Database/sequelize.database').resource
const UserModel = require('../../Database/sequelize.database').user

module.exports = {
  create: async function (body) {
    let result;

    try {
      result = await ProductModel.create(body);

    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  /**
   *
   * @param {Object} filter - Query filter
   * @param {*} skip
   * @param {*} limit
   * @returns
   */
  getTotalItem: async function (filter = {}) {
    let result;

    try {
      result = await ProductModel.count(filter)
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  getAll: async function (filter = {}, skip = 0, limit = 0) {
    let result;

    let list_exc = ["userId", "createdBy", "updatedBy", "deletedAt", "deletedBy", "createdAt", "updatedAt", "productId", "transactionId"]
    try {
      
      filter.include = [
        {
          model: UserModel,
          as: 'created_by',
        },
        {
          model: TransactionModel,
          as: "transactions",
          attributes: { exclude: list_exc },
          through: {
            model: ResourceModel,
            as: "resource",
            attributes: ["qty"],
          }
        }
      ]

      filter.attributes = { exclude: ["userId", "createdBy" ]}

      result = await ProductModel.findAll(filter)

      if (!result) result = null;
      
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  getById: async function (id) {
    let filter = {}
    let result;

    let list_exc = ["userId", "createdBy", "updatedBy", "deletedAt", "deletedBy", "createdAt", "updatedAt", "productId", "transactionId"]
    try {

      filter.include = [
        {
          model: UserModel,
          as: 'created_by',
        },
        {
          model: TransactionModel,
          as: "transactions",
          attributes: { exclude: list_exc },
          through: {
            model: ResourceModel,
            as: "resource",
            attributes: ["qty"],
          }
        }
      ]

      filter.attributes = { exclude: ["userId", "createdBy" ]}
      filter.where = { id }

      result = await ProductModel.findOne(filter)
      if (!result) result = null;
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  increment: async function (num, where) {
    let result;

    try {
      result = await ProductModel.increment( { qty: num }, { where } )
      if (!result) result = null;
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  update: async function (filter, body) {
    let result;

    try {
      result = await ProductModel.update(body, filter)
      if (!result) result = null;
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  delete: async function (where) {
    let result;

    try {
      
      result = ProductModel.destroy({where});
      if (!result) result = null;

    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },
};