'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      products.belongsTo(models.user, { as: "created_by", foreignKey: "createdBy" } );
      products.belongsToMany(models.transaction, { 
        as: "transactions",
        through: {
          model: 'resource',
          as: "resource",
          foreignKey: "productId"
        }
       } );
    }
  }
  products.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    qty: DataTypes.FLOAT,
    unit: DataTypes.STRING,
    brand: DataTypes.STRING,
    desc: DataTypes.STRING,

    /** Flag */
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE,
    deletedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product',
  });
  return products;
};