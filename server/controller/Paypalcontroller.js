const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../Paypal');

exports.createPayment = async (req, res) => {
    const { amount } = req.body;
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: amount  
                }
            }
        ],
        application_context: {
            return_url: 'http://localhost:3000/paypal/success',
            cancel_url: 'http://localhost:3000/paypal/cancel'
        }
    });

    try {
        const order = await client().execute(request);
        res.status(200).json({ id: order.result.id });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.capturePayment = async (req, res) => {
    const { orderId } = req.params;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const capture = await client().execute(request);
        res.status(200).json(capture.result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
