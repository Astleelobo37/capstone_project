import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useMasks } from '../contexts/MaskContext';
import { useCart } from '../contexts/CartContext';
import { MaskGrid } from './MaskGrid';

const OtherMasks = () => {
  const { masks, fetchMasks, loading } = useMasks();
  const { addToCart } = useCart();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleAddToCart = (mask) => {
    try {
      if (mask.stock <= 0) {
        setSnackbar({
          open: true,
          message: 'Item is out of stock',
          severity: 'error'
        });
        return;
      }
      
      addToCart({
        id: mask.id,
        name: mask.maskType,
        price: mask.price,
        image: mask.imageUrl,
        stock: mask.stock
      });
      
      setSnackbar({
        open: true,
        message: 'Item added to cart successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add item to cart',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <MaskGrid masks={masks} handleAddToCart={handleAddToCart} />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default OtherMasks; 