const db = require("../models");
const OrderStatus = db.orderStatus;

exports.statues = (req, res) => {
  OrderStatus.findAll().then(statuses => {
    res.status(200).send(statuses);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
};
