module.exports = (sequelize, Sequelize) => {
  const FinanceSource = sequelize.define("finance_sources", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  }, { timestamps: false });

  return FinanceSource;
};