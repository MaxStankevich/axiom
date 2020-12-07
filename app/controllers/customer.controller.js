const { Op } = require("sequelize");
const db = require("../models");
const pagination = require("../utils/pagination");
const Customer = db.customer;

exports.customers = (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = pagination.getPagination(page, size);

  Customer.findAndCountAll({
    distinct: true,
    limit,
    offset,
    where: {
      deleted: { [Op.not]: true },
      ...(search ? { email: { [Op.like]: `%${search}%` } } : {})
    },
    include: ["orders"],
  }).then(customers => {
    res.status(200).send(pagination.getPagingData(customers, page, limit));
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
};

exports.customer = (req, res) => {
  Customer.findByPk(req.params.id, {
    include: [
      { model: db.order, include: ["orderStatus", "products", "user"] },
    ],
  }).then(customer => {
    res.status(200).send(customer);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.updateCustomer = (req, res) => {
  Customer.findByPk(req.params.id).then(customer => {
    customer.update(req.body).then(customer => {
      res.status(200).send(customer);
    });
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.createCustomer = (req, res) => {
  Customer.create(req.body).then(customer => {
    res.status(201).send(customer);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.deleteCustomer = (req, res) => {
  Customer.findByPk(req.params.id)
    .then(customer => {
      return customer.update({ deleted: true })
    }).then(() => {
    res.status(204).end();
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};
