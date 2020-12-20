module.exports = (sequelize, Sequelize) => {
  const OrderStatusHistory = sequelize.define('order_status_history', {
    statusName: Sequelize.STRING
  });

  return OrderStatusHistory;
};