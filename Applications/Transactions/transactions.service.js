/**
 *
 * Unit services
 */

// const UserModel = require('./user.model').User;
const TransactionModel = require('../../Database/sequelize.database').transaction
const UserModel = require('../../Database/sequelize.database').user
const ProductModel = require('../../Database/sequelize.database').product
const ResourceModel = require('../../Database/sequelize.database').resource

module.exports = {
  create: async function (body) {
    let result;

    try {
      
      result = await TransactionModel.create(body);
      if (!result) result = null;

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
      result = await TransactionModel.count(filter)
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  getAll: async function (filter = {}, skip = 0, limit = 0) {
    let result;

    let list_exc = ["userId", "createdBy", "updatedBy", "deletedAt", "deletedBy", "createdAt", "updatedAt", "productId"]
    try {
      filter.include = [
        {
          model: UserModel,
          as: 'created_by',
        },
        {
          model: ProductModel,
          as: "products",
          attributes: { exclude: list_exc },
          through: {
            model: ResourceModel,
            as: "resource",
            attributes: { exclude: list_exc.concat(["transactionId"]) },
          }
        }
      ]

      filter.attributes = { exclude: ["userId", "productId", "createdBy" ]}

      result = await TransactionModel.findAll(filter)
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

    let list_exc = ["userId", "createdBy", "updatedBy", "deletedAt", "deletedBy", "createdAt", "updatedAt", "productId"]
    try {

      filter.include = [
        {
          model: UserModel,
          as: 'created_by',
        },
        {
          model: ProductModel,
          as: "products",
          attributes: { exclude: list_exc },
          through: {
            model: ResourceModel,
            as: "resource",
            attributes: { exclude: list_exc.concat(["transactionId"]) },
          }
        }
      ]

      filter.attributes = { exclude: ["userId", "createdBy" ]}
      filter.where = { id }

      result = await TransactionModel.findOne(filter)
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
      result = await TransactionModel.update(body, filter)
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
      
      result = TransactionModel.destroy({where});
      if (!result) result = null;

    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },
};