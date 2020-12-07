module.exports = (sequelize, Sequelize) => {
  const DeliveryMethod = sequelize.define("delivery_methods", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  }, { timestamps: false });

  return DeliveryMethod;
};