'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transactions.belongsTo(models.user, { as: "created_by", foreignKey: "createdBy"})
      transactions.belongsToMany(models.product, {
        as: "products",
        through: {
          model: "resource",
          as: "resource",
          foreignKey: "transactionId"
        }
      })
    }
  }
  transactions.init({
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    type: DataTypes.ENUM(['penambahan', 'pengurangan']),

    /** Flag */
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE,
    deletedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transactions;
};