const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.order = require("../models/order.model.js")(sequelize, Sequelize);
db.deliveryMethod = require("../models/deliveryMethod.model.js")(sequelize, Sequelize);
db.orderStatus = require("../models/orderStatus.model.js")(sequelize, Sequelize);
db.customer = require("../models/customer.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.orderProduct = require("../models/orderProduct.model.js")(sequelize, Sequelize);
db.orderStatusHistory = require("../models/orderStatusHistory.model.js")(sequelize, Sequelize);
db.financeSource = require("../models/financeSource.model.js")(sequelize, Sequelize);

db.user.belongsTo(db.role, {
  foreignKey: "roleId",
  as: "role",
});
db.order.belongsTo(db.deliveryMethod, {
  foreignKey: "deliveryMethodId",
  as: "deliveryMethod",
});
db.order.belongsTo(db.orderStatus, {
  foreignKey: "orderStatusId",
  as: "orderStatus",
});
db.order.belongsTo(db.customer, {
  foreignKey: "customerId",
  as: "customer",
});
db.order.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});
db.order.belongsTo(db.financeSource, {
  foreignKey: "financeSourceId",
  as: "financeSource",
});

db.customer.hasMany(db.order);
db.order.hasMany(db.orderStatusHistory, { as: 'orderStatusHistories' });
db.order.belongsToMany(db.product, { through: db.orderProduct });
db.product.belongsToMany(db.order, { through: db.orderProduct });

db.ROLES = ["admin", "manager"];
db.DELIVERY_METHODS = ["pickup", "courier"];

module.exports = db;