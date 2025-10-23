const {validatePaymentVerification}=require("razorpay/dist/utils/razorpay-utils")
const apiKey = process.env.RAZORPAY_KEY_SECRET || "";

 async function verifySignature(
  orderId,
  paymentId,
  signature
) {
  try {
    const data = validatePaymentVerification(
      { order_id: orderId, payment_id: paymentId },
      signature,
      apiKey,
    );
    return Promise.resolve(data);
  } catch (err) {
    console.log(err);
    return Promise.resolve(null);
  }
}

module.exports = {verifySignature};