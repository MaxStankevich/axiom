const { authJwt } = require("../middleware");
const controller = require("../controllers/product.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/products",
    controller.products
  );

  app.get(
    "/api/products/:id",
    [authJwt.verifyToken],
    controller.product
  );

  app.post(
    "/api/products",
    [authJwt.verifyToken],
    controller.createProduct
  );

  app.put(
    "/api/products/:id",
    [authJwt.verifyToken],
    controller.updateProduct
  );

  app.delete(
    "/api/products/:id",
    [authJwt.verifyToken],
    controller.deleteProduct
  );
};