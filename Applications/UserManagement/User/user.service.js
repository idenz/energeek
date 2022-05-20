/**
 *
 * Unit services
 */

// const UserModel = require('./user.model').User;
const UserModel = require('../../../Database/sequelize.database').user
const bcrypt = require('bcryptjs');

module.exports = {
  create: async function (body) {
    let result;

    try {
      const _query = { where: { email: body.email } }

      findUser = await UserModel.count(_query);

      if (findUser !== 0) {
        result = "exists";
      } else {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(body.password, passwordSalt);

        body.password = passwordHash;
        result = await UserModel.create(body);
        if (!result) result = null;
      }

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
      result = await UserModel.count(filter)
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  getAll: async function (filter = {}, skip = 0, limit = 0) {
    let result;

    try {
      result = await UserModel.findAll(filter)

      if (!result) result = null;
      
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  getAllWithPassword: async function (filter = {}, skip = 0, limit = 0) {
    let result;

    try {
      result = await UserModel.find(filter)

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
      result = await UserModel.findByPk(id)
      if (!result) result = null;
    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },

  getByEmail: async function (email) {
    let result;

    try {
      let filter = { where: { email } }
      result = await UserModel.findOne(filter)

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
      result = await UserModel.update(body, filter)
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
      
      result = UserModel.destroy({where});
      if (!result) result = null;

    } catch (error) {
      result = null;
      console.log(error);
    }

    return result;
  },
};