const { authJwt } = require("../middleware");
const controller = require("../controllers/order.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/orders",
    [authJwt.verifyToken],
    controller.orders
  );

  app.get(
    "/api/orders/:id",
    [authJwt.verifyToken],
    controller.order
  );

  app.post(
    "/api/orders",
    controller.createOrder
  );

  app.put(
    "/api/orders/:id",
    [authJwt.verifyToken],
    controller.updateOrder
  );

  app.delete(
    "/api/orders/:id",
    [authJwt.verifyToken],
    controller.deleteOrder
  );
};