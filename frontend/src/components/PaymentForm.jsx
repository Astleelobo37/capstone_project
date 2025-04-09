import React, { useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box
} from '@mui/material';

const PaymentForm = ({ onPaymentChange }) => {
  const [payment, setPayment] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedPayment = {
      ...payment,
      [name]: value
    };
    setPayment(updatedPayment);
    onPaymentChange(updatedPayment);
  };

  const textFieldStyle = {
    '& label.Mui-focused': {
      color: '#2196f3',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#2196f3',
      },
    },
  };

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ color: '#2196f3', fontWeight: 600, mb: 3 }}>
        Payment Details
      </Typography>
      <Box component="form">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={payment.cardNumber}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 16 }}
              placeholder="1234 5678 9012 3456"
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Holder Name"
              name="cardHolder"
              value={payment.cardHolder}
              onChange={handleChange}
              required
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              name="expiryDate"
              value={payment.expiryDate}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 5 }}
              placeholder="MM/YY"
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CVV"
              name="cvv"
              type="password"
              value={payment.cvv}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 3 }}
              sx={textFieldStyle}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PaymentForm;