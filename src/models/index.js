const userModel = require("./userModel");
const customerModel = require("./customerModel");
const categoryModel = require("./categoryModel");
const brandModel = require("./brandModel");
const productModel = require("./productModel");
const productCategoryModel = require("./productCategoryModel");
const cartModel = require("./cartModel");
const cartProductModel = require("./cartProductModel");
const { orderModel,orderProductModel} = require("./orderModel");
const addressModel = require("./addressModel");
const storeModel = require("./storeModel");
const paymentModel = require("./paymentModel");

/* ------------------ Address Associations ------------------ */
customerModel.hasMany(addressModel, { foreignKey: "customerId", as: "addresses" });
addressModel.belongsTo(customerModel, { foreignKey: "customerId", as: "customer" });

storeModel.hasOne(addressModel, { foreignKey: "storeId", as: "address" });
addressModel.belongsTo(storeModel, { foreignKey: "storeId", as: "store" });

/* ------------------ Brand ------------------ */
brandModel.belongsTo(userModel, { foreignKey: "createdBy", as: "createdByUser" });

/* ------------------ Category ------------------ */
categoryModel.belongsTo(userModel, { foreignKey: "createdBy", as: "createdByUser" });

productModel.belongsToMany(categoryModel, {
  through: productCategoryModel,
  foreignKey: "productId",
  as: "categories",
});

categoryModel.belongsToMany(productModel, {
  through: productCategoryModel,
  foreignKey: "categoryId",
  as: "products",
});

/* ------------------ Cart (Shared by both User & Customer) ------------------ */
customerModel.hasOne(cartModel, { foreignKey: "customerId", as: "cart" });
cartModel.belongsTo(customerModel, { foreignKey: "customerId", as: "customer" });

userModel.hasOne(cartModel, { foreignKey: "userId", as: "cart" });
cartModel.belongsTo(userModel, { foreignKey: "userId", as: "user" });

/* ------------------ Cart Products ------------------ */
cartModel.hasMany(cartProductModel, { foreignKey: "cartId", as: "cartProducts" });
cartProductModel.belongsTo(cartModel, { foreignKey: "cartId", as: "cart" });

cartProductModel.belongsTo(productModel, { foreignKey: "productId", as: "product" });
productModel.hasMany(cartProductModel, { foreignKey: "productId", as: "cartProducts" });

cartModel.belongsToMany(productModel, {
  through: cartProductModel,
  foreignKey: "cartId",
  otherKey: "productId",
  as: "products",
});
productModel.belongsToMany(cartModel, {
  through: cartProductModel,
  foreignKey: "productId",
  otherKey: "cartId",
  as: "carts",
});

/* ------------------ Orders ------------------ */
orderModel.belongsTo(customerModel, { foreignKey: "customerId", as: "customer" });
orderModel.belongsTo(userModel, { foreignKey: "userId", as: "user" });
orderModel.belongsTo(addressModel, { foreignKey: "addressId", as: "address" });

orderModel.hasMany(orderProductModel, { as: "orderProducts", foreignKey: "orderId" });
orderProductModel.belongsTo(orderModel, { foreignKey: "orderId" });

productModel.hasMany(orderProductModel, { as: "orderProducts", foreignKey: "productId" });
orderProductModel.belongsTo(productModel, { as: "product", foreignKey: "productId" });


/* ------------------ Product ------------------ */
productModel.belongsTo(brandModel, { foreignKey: "brandId", as: "brand" });

// productModel.belongsTo(storeModel, { foreignKey: "storeId", as: "store" });
// storeModel.hasMany(productModel, { foreignKey: "storeId", as: "products" });


//paymentModel
orderModel.hasOne(paymentModel, { foreignKey: "orderId", as: "payment" });
paymentModel.belongsTo(orderModel, { foreignKey: "orderId", as: "order" });


module.exports = {
  userModel,
  customerModel,
  categoryModel,
  brandModel,
  productModel,
  productCategoryModel,
  cartModel,
  cartProductModel,
  orderModel,
  addressModel,
  storeModel,
  orderProductModel,
  paymentModel
};
