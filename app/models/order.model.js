module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    deliveryAddress: {
      type: Sequelize.STRING
    },
    contactNumber: {
      type: Sequelize.INTEGER
    },
    contactName: {
      type: Sequelize.STRING
    },
    contactSurname: {
      type: Sequelize.STRING
    },
    contactPatronymic: {
      type: Sequelize.STRING
    },
    notes: {
      type: Sequelize.STRING
    },
    invoice: {
      type: Sequelize.STRING
    },
    deleted: {
      type: Sequelize.BOOLEAN
    }
  });

  return Order;
};