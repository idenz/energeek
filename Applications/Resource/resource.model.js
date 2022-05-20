'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resources extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  resources.init({
    productId: DataTypes.INTEGER,
    transactionId: DataTypes.INTEGER,
    qty: DataTypes.FLOAT,

    /** Flag */
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE,
    deletedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'resource',
  });
  return resources;
};