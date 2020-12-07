const { Op } = require("sequelize");
const db = require("../models");
const pagination = require("../utils/pagination");
const Order = db.order;
const Customer = db.customer;
const Product = db.product;
const OrderProduct = db.orderProduct;

exports.orders = (req, res) => {
  const { page, size, filter, order } = req.query;
  const { limit, offset } = pagination.getPagination(page, size);

  Order.findAndCountAll({
    distinct: true,
    limit,
    offset,
    where: { deleted: { [Op.not]: true } , ...JSON.parse(filter || "{}")},
    include: ["orderStatus", "deliveryMethod", "customer", "user", "products"],
    order: JSON.parse(order || "[]"),
  }).then(orders => {
    res.status(200).send(pagination.getPagingData(orders, page, limit));
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
};

exports.order = (req, res) => {
  Order.findByPk(req.params.id, {
    include: ["orderStatus", "deliveryMethod", "customer", "user", "products"],
  }).then(order => {
    res.status(200).send(order);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.updateOrder = async (req, res) => {
  try {
    const { products, ...body } = req.body;
    let order = await Order.findByPk(req.params.id, {
      include: "products",
    });
    if (order) {
      await order.update(body);
      if (order && products && products.length) {
        for (let i = 0; i < products.length; i++) {
          const { id, quantity, _destroy } = products[i];
          const product = await Product.findByPk(id);
          const existingProduct = await OrderProduct.findOne({
            where: { orderId: req.params.id, productId: id }
          });
          if (_destroy) {
            await order.removeProduct(product)
          } else if (existingProduct) {
            await existingProduct.update({ quantity })
          } else {
            console.log(product);
            await order.addProduct(product, { through: { quantity } })
          }
        }
      }
      res.status(200).send(order);
    } else {
      throw new Error("Не удалось найти заказ");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    let order;
    let customerId = req.body.customerId;
    const { customer: bodyCustomer, products, ...body } = req.body;
    if (!customerId && bodyCustomer && bodyCustomer.email) {
      let [customer] = await Customer.findOrCreate({
        where: { email: bodyCustomer.email },
        defaults: bodyCustomer
      });
      if (customer) {
        customerId = customer.id;
      } else {
        throw new Error("Не удалось сохранить заказчика");
      }
    }
    if (customerId) {
      order = await Order.create({ deleted: false, orderStatusId: 1, customerId, ...body });
      if (order && products && products.length) {
        for (let i = 0; i < products.length; i++) {
          const { id, quantity } = products[i];
          const product = await Product.findByPk(id);
          if (product) {
            await order.addProduct(product, { through: { quantity } })
          }
        }
        res.status(201).send(order);
      }
    } else {
      throw new Error("Не удалось сохранить заказчика");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteOrder = (req, res) => {
  Order.findByPk(req.params.id)
    .then(order => {
      return order.update({ deleted: true })
    }).then(() => {
    res.status(204).end();
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};
