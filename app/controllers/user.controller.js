const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.user;

exports.users = (req, res) => {
  User.findAll({
    include: "role",
    attributes: { exclude: ['password'] }
  }).then(users => {
    res.status(200).send(users);
  })
};

exports.user = (req, res) => {
  User.findByPk(req.params.id, {
    include: "role",
    attributes: { exclude: ['password'] }
  }).then(user => {
    res.status(200).send(user);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.updateUser = (req, res) => {
  const userData = req.body;
  if (req.body.password) {
    userData.password = bcrypt.hashSync(req.body.password, 8)
  }
  User.findByPk(req.params.id).then(user => {
    user.update(userData).then(user => {
      user.getRole().then(role => {
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: role,
        });
      });
    });
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};

exports.deleteUser = (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.status(200).end();
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
};
