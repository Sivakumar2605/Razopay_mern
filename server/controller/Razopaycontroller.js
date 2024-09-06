
const razorpayInstance = require('../razopay');
const crypto = require('crypto');
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const options = {
            amount: amount * 100,
            currency: currency || "INR",
            receipt: `receipt_order_${new Date().getTime()}`
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            console.error("Order creation failed");
            return res.status(500).send("Some error occurred");
        }

        res.json(order);
    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).send(error.message);
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
            res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
