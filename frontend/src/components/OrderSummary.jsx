import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider
} from '@mui/material';

const OrderSummary = ({ subtotal, shipping = 0 }) => {
  const total = subtotal + shipping;

  return (
    <Paper sx={{ p: 4, mb: 3, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600, color: '#2196f3' }}>
        Order Summary
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#555' }}>Subtotal</Typography>
          <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 500 }}>${Number(subtotal).toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#555' }}>Shipping</Typography>
          <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 500 }}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Typography>
        </Box>
        <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2196f3' }}>Total</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2196f3' }}>${total.toFixed(2)}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderSummary;