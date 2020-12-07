const { authJwt } = require("../middleware");
const controller = require("../controllers/customer.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/customers",
    [authJwt.verifyToken],
    controller.customers
  );

  app.get(
    "/api/customers/:id",
    [authJwt.verifyToken],
    controller.customer
  );

  app.post(
    "/api/customers",
    [authJwt.verifyToken],
    controller.createCustomer
  );

  app.put(
    "/api/customers/:id",
    [authJwt.verifyToken],
    controller.updateCustomer
  );

  app.delete(
    "/api/customers/:id",
    [authJwt.verifyToken],
    controller.deleteCustomer
  );
};