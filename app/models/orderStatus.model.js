module.exports = (sequelize, Sequelize) => {
  const OrderStatus = sequelize.define("order_statuses", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  }, { timestamps: false });

  return OrderStatus;
};