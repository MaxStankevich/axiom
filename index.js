const express = require('express')
const path = require('path')
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:3000"
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const User = db.user;
const DeliveryMethod = db.deliveryMethod;
const OrderStatus = db.orderStatus;
const Customer = db.customer;
const Order = db.order;
const Product = db.product;

// { force: true }
db.sequelize.sync().then(() => {
  console.log('Drop and Resync Db');
  // initial();
});

// simple route
app.get("/test", (req, res) => {
  console.log("test");
  res.json({ message: "Welcome to axiom application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/order.routes')(app);
require('./app/routes/customer.routes')(app);
require('./app/routes/orderStatus.routes')(app);
require('./app/routes/product.routes')(app);

const PORT = process.env.PORT || 5000

app
  .use(express.static(path.join(__dirname, 'client', 'build')))
  .get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })

app.listen(PORT, () => console.log(`Listening on ${PORT}`))

function initial() {
  Role.create({
    id: 1,
    name: "admin"
  }).then((role) => {
    console.log(">> Created role: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating role: ", err);
    });

  Role.create({
    id: 2,
    name: "manager"
  }).then((role) => {
    console.log(">> Created role: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating role: ", err);
    });

  User.create({
    username: "admin",
    email: "admin@admin.admin",
    password: bcrypt.hashSync("admin", 8)
  })
    .then(user => {
      Role.findOne({
        where: {
          name: "admin"
        }
      }).then(role => {
        user.setRole(role).then(() => {
          console.log({ message: "User was registered successfully!" });
        });
      });
    })
    .catch(err => {
      console.log({ message: err.message });
    });

  User.create({
    username: "manager",
    email: "manager@manager.manager",
    password: bcrypt.hashSync("manager", 8),
    roleId: 2
  })
    .then(() => {
      console.log({ message: "User was registered successfully!" });
    })
    .catch(err => {
      console.log({ message: err.message });
    });

  DeliveryMethod.create({
    id: 1,
    name: "Самовывоз"
  }).then((role) => {
    console.log(">> Created DeliveryMethod: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating DeliveryMethod: ", err);
    });

  DeliveryMethod.create({
    id: 2,
    name: "Курьер"
  }).then((role) => {
    console.log(">> Created DeliveryMethod: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating DeliveryMethod: ", err);
    });

  OrderStatus.create({
    id: 1,
    name: "Не обработан"
  }).then((role) => {
    console.log(">> Created OrderStatus: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating OrderStatus: ", err);
    });

  OrderStatus.create({
    id: 2,
    name: "Принят"
  }).then((role) => {
    console.log(">> Created OrderStatus: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating OrderStatus: ", err);
    });

  OrderStatus.create({
    id: 3,
    name: "Документы отправлены"
  }).then((role) => {
    console.log(">> Created OrderStatus: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating OrderStatus: ", err);
    });

  OrderStatus.create({
    id: 4,
    name: "Оплачен"
  }).then((role) => {
    console.log(">> Created OrderStatus: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating OrderStatus: ", err);
    });

  OrderStatus.create({
    id: 5,
    name: "Отправлен"
  }).then((role) => {
    console.log(">> Created OrderStatus: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating OrderStatus: ", err);
    });

  Customer.create({
    email: "customer@cus.cus",
    organizationName: "OOO Horns and hooves",
    address: "г. Минск, ул. Пушкина, д. Колотушкина",
    bankAccountNumber: 123456789,
    bankName: "Альфа-банк",
    payerAccountNumber: 123456789,
    deleted: false
  }).then((role) => {
    console.log(">> Created Сustomer: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating Сustomer: ", err);
    });

  Order.create({
    deliveryMethodId: 1,
    contactNumber: "123456789",
    contactName: "Вася",
    notes: "test",
    customerId: 1,
    userId: 1,
    orderStatusId: 1,
    deleted: false
  }).then((role) => {
    console.log(">> Created Order: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating Order: ", err);
    });

  Product.create({
    name: "Комплект для контактного чтения ACR39U-U1",
    description: "работает с пластиковыми ID-картами"
  }).then((role) => {
    console.log(">> Created Product: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating Product: ", err);
    });

  Product.create({
    name: "Комплект для бесконтактного чтения ACR122U-A9",
    description: "работает с пластиковыми ID-картами и бумажными RFID-паспортами"
  }).then((role) => {
    console.log(">> Created Product: " + JSON.stringify(role, null, 4));
  })
    .catch((err) => {
      console.log(">> Error while creating Product: ", err);
    });
}