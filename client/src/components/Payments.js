import React, { useState, useRef } from 'react';
import { Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, Box } from '@mui/material';
import RazorpayIntegration from './RazorpayIntegration';
import PaypalIntegration from './Paypalintegration';

const PaymentUI = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [amount, setAmount] = useState(500);
  const razorpayRef = useRef(null);
  const paypalRef = useRef(null);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePayClick = () => {
    if (selectedPaymentMethod === 'razorpay') {
      if (razorpayRef.current) {
        razorpayRef.current.initializePayment();
      }
    } else if (selectedPaymentMethod === 'paypal') {
      if (paypalRef.current) {
        paypalRef.current.initializePayment();
      }
    } else {
      window.alert('Please select a valid payment method.');
    }
  };

  return (
    <Box style={{ textAlign: 'center', padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Payment Method
      </Typography>
      <FormControl component="fieldset" style={{ margin: '16px 0' }}>
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={selectedPaymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <FormControlLabel 
            value="razorpay" 
            control={<Radio />} 
            label="Pay with Razorpay" 
          />
          <FormControlLabel 
            value="paypal" 
            control={<Radio />} 
            label="Pay with PayPal" 
          />
          <FormControlLabel 
            value="billdesk" 
            control={<Radio />} 
            label="Pay with BillDesk" 
            disabled 
          />
        </RadioGroup>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePayClick}
        disabled={!selectedPaymentMethod}
        style={{ margin: '16px' }}
      >
        Pay Rs. {amount}
      </Button>
      <RazorpayIntegration
        ref={razorpayRef}
        amount={amount}
        details={`Payment for order #12345`}
        onSuccess={() => {
          alert('Payment successful!');
        }}
        onFailure={() => {
          alert('Payment failed. Please try again.');
        }}
      />
      <PaypalIntegration
        ref={paypalRef}
        amount={amount } 
        onSuccess={() => {
          alert('Payment successful!');
        }}
        onFailure={() => {
          alert('Payment failed. Please try again.');
        }}
      />
    </Box>
  );
};

export default PaymentUI;
