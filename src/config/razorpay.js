const Razorpay = require('razorpay');

var razorPayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID||'',
  key_secret: process.env.RAZORPAY_KEY_SECRET||'',
});

module.exports=razorPayClient