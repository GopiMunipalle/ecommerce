const {
  cartModel,
  orderModel,
  paymentModel,
  productModel,
  orderProductModel,
  cartProductModel,
} = require("../models/index");
const { sendError, sendSuccess } = require("../utils/response");
const crypto = require("crypto");
const { sequelize } = require("../config/dbConfig");
const {
  verifySignature,
} = require("../utils/razorpaySignatureVerificationUtil");

function verifyWebhookSignature(req) {
  try {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.rawBody || JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return false;
  }
}

async function razorpayWebhook(req, res) {
  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "payment.captured") {
    const t = await sequelize.transaction();
    try {
      if (!verifyWebhookSignature(req)) {
        await t.rollback();
        return sendError(res, 400, { error: "Invalid payment signature" });
      }

      const paymentId = payload.payment.entity.id;
      const rzpOrderId = payload.payment.entity.order_id;
      const amount = payload.payment.entity.amount;

      const orderDoc = await orderModel.findOne({
        where: { rzpOrderId },
        include: [
          {
            model: orderProductModel,
            as: "orderProducts",
            include: [{ model: productModel, as: "product" }],
          },
        ],
        transaction: t,
      });

      if (!orderDoc || orderDoc.status === "SUCCESS") {
        await t.rollback();
        return res
          .status(200)
          .json({ message: "Order already processed or not found" });
      }

      const paymentDoc = await paymentModel.create(
        {
          rzpOrderId,
          rzpPaymentId: paymentId,
          amount: Number(amount) / 100,
          status: "captured",
          paymentMode: payload.payment.entity.method,
          orderId: orderDoc.id,
        },
        { transaction: t }
      );

      for (const op of orderDoc.orderProducts) {
        const product = op.product;
        product.quantity -= op.quantity;
        await product.save({ transaction: t });
      }

      orderDoc.status = "SUCCESS";
      orderDoc.paymentMode = payload.payment.entity.method;
      await orderDoc.save({ transaction: t });

      const userId = orderDoc.userId;
      const customerId = orderDoc.customerId;
      let cart;
      if (userId) {
        cart = await cartModel.findOne({ where: { userId } });
      } else if (customerId) {
        cart = await cartModel.findOne({ where: { customerId } });
      }
      if (cart) {
        await cartProductModel.destroy({ where: { cartId: cart.id } });
      }

      await t.commit();
      return res
        .status(200)
        .json({ message: "Payment confirmed successfully" });
    } catch (err) {
      console.error(err);
      await t.rollback();
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(200).json({ message: "Event ignored" });
}

// async function confirmCartPayment(req, res) {
//   const t = await sequelize.transaction();
//   try {
//     const { orderId, rzpOrderId, paymentId, signature } = req.body;

//     const order = await orderModel.findOne({
//       where: { id: orderId, orderType: "CART" },
//       include: [{ model: productModel, as: "product" }],
//     });

//     if (!order) {
//       await t.rollback();
//       return res.status(404).json({ error: "Order not found" });
//     }

//     if (order.orderStatus === "SUCCESS") {
//       await t.rollback();
//       return res.status(400).json({ error: "Payment already done" });
//     }

//     const isValid = await verifySignature(signature, rzpOrderId, paymentId);
//     if (!isValid) {
//       await t.rollback();
//       return res.status(400).json({ error: "Invalid payment signature" });
//     }

//     const paymentDetails = await razorpayClient.payments.fetch(paymentId);

//     const paymentDoc = await paymentModel.create(
//       {
//         rzpOrderId: paymentDetails.order_id,
//         rzpPaymentId: paymentDetails.id,
//         paymentMode: paymentDetails.method,
//         amount: Number(paymentDetails.amount),
//         status: paymentDetails.status,
//       },
//       { transaction: t }
//     );

//     const products = await order.getProduct();
//     for (let product of products) {
//       product.quantity -= product.order_products.quantity;
//       await product.save({ transaction: t });
//     }

//     order.orderStatus = "SUCCESS";
//     order.paymentMode = paymentDetails.method;

//     await Promise.all([
//       order.save({ transaction: t }),
//       order.setPaymentDetails(paymentDoc, { transaction: t }),
//     ]);

//     await t.commit();

//     return res.json({
//       data: {
//         message: "Cart payment confirmed successfully",
//         orderDetails: order.toJSON(),
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     await t.rollback();
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

module.exports = { razorpayWebhook };
