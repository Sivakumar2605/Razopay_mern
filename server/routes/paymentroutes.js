
const express = require('express');
const { createOrder, verifyPayment } = require('../controller/Razopaycontroller');

const paypalController = require('../controller/Paypalcontroller');



const router = express.Router();


router.post('/order', createOrder);


router.post('/verify', verifyPayment);

router.post('/create-paypal-payment', paypalController.createPayment);
router.post('/capture-paypal-payment/:orderId', paypalController.capturePayment);

module.exports = router;
