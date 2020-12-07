module.exports = (sequelize, Sequelize) => {
  const OrderProduct = sequelize.define('order_product', {
    quantity: Sequelize.INTEGER
  }, { timestamps: false });

  return OrderProduct;
};