const db = require("../models");
const FinanceSource = db.financeSource;

exports.sources = (req, res) => {
  FinanceSource.findAll().then(sources => {
    res.status(200).send(sources);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
};