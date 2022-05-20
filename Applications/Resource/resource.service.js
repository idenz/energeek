/**
 *
 * Resource services
 */

// const UserModel = require('./user.model').User;
const ResourceModel = require('../../Database/sequelize.database').resource

module.exports = {
  create: async function (body) {
    let result;

    try {
      
      result = await ResourceModel.create(body);
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
      result = await ResourceModel.count(filter)
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  getAll: async function (filter = {}, skip = 0, limit = 0) {
    let result;

    try {
      result = await ResourceModel.findAll(filter)
      if (!result) result = null;
      
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  getById: async function (id) {
    let result;

    try {
      result = await ResourceModel.findByPk(id)
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
      result = await ResourceModel.update(body, filter)
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
      
      result = ResourceModel.destroy({where});
      if (!result) result = null;

    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },
};