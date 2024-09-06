import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';

const RazorpayIntegration = forwardRef(({ amount, details, onSuccess, onFailure }, ref) => {
  
  useImperativeHandle(ref, () => ({
    initializePayment: async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/payment/order', {
          amount,
          currency: 'INR',
          details,
        });

        const order = res.data;

        const options = {
          key: 'rzp_test_EIDAWq67memvd9', 
          amount: order.amount,
          currency: order.currency,
          name: 'Siva Payment',
          description: details,
          order_id: order.id,
          handler: async function (response) {
            const data = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            try {
              const verifyRes = await axios.post('http://localhost:5000/api/payment/verify', data);
              const result = verifyRes.data;

              if (result.success) {
                onSuccess('Payment was successful!');
              } else {
                onFailure('Payment verification failed.');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              onFailure('Payment verification failed.');
            }
          },
          prefill: {
            name: 'sivakumar',
            email: 'siva@gmail.com',
            contact: '7032514136',
          },
          theme: {
            color: '#F37254',
          },
          modal: {
            ondismiss: function() {
              console.log('Payment modal closed');
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on('payment.failed', function (response) {
          onFailure('Payment failed. Please try again.');
        });
      } catch (error) {
        console.error('Order creation error:', error);
        onFailure('Order creation failed.');
      }
    }
  }));

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
});

export default RazorpayIntegration;
