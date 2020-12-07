module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customers", {
    email: {
      type: Sequelize.STRING
    },
    organizationName: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    bankAccountNumber: {
      type: Sequelize.STRING
    },
    bankName: {
      type: Sequelize.STRING
    },
    payerAccountNumber: {
      type: Sequelize.INTEGER
    },
    deleted: {
      type: Sequelize.BOOLEAN
    }
  });

  return Customer;
};