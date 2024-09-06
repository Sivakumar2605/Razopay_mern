import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';

const PaypalIntegration = forwardRef(({ amount, onSuccess, onFailure }, ref) => {
  
  useImperativeHandle(ref, () => ({
    initializePayment: async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/payment/create-paypal-payment', {
          amount,
        });

        const orderId = res.data.id;

        const paypalButtons = window.paypal.Buttons({
          createOrder: function() {
            return orderId;
          },
          onApprove: async function(data) {
            try {
              const captureRes = await axios.post(`http://localhost:5000/api/payment/capture-paypal-payment/${data.orderID}`);
              onSuccess('Payment was successful!');
            } catch (error) {
              console.error('Payment capture error:', error);
              onFailure('Payment capture failed.');
            }
          },
          onCancel: function() {
            onFailure('Payment was canceled.');
          },
          onError: function(err) {
            console.error('Payment error:', err);
            onFailure('Payment failed.');
          }
        });

        paypalButtons.render('#paypal-button-container');
      } catch (error) {
        console.error('Order creation error:', error);
        onFailure('Order creation failed.');
      }
    }
  }));

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AfN80NziNFJRAjm32OKLk1hzRzOIcfN9ZW-D4zRaNnmcURDbNcpFcD1xDc3TwSUYGNQoBC7CMpWmA5ZD';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="paypal-button-container"></div>;
});

export default PaypalIntegration;
