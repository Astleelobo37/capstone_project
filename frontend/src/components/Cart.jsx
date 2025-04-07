import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Box,
  List,
  ListItem,
  CardMedia,
  Alert,
  Snackbar
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useMask } from '../contexts/MaskContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCart, masks, updateMaskStock } = useMask();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleQuantityChange = async (maskId, newQuantity) => {
    try {
      const mask = masks.find(m => m.id === maskId);
      if (!mask) return;

      if (newQuantity < 1) {
        handleDeleteItem(maskId);
        return;
      }

      if (newQuantity > mask.stock) {
        setSnackbarMessage('Not enough stock available');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      const updatedCart = cart.map(item => 
        item.id === maskId ? { ...item, quantity: newQuantity } : item
      );

      updateCart(updatedCart);
      setSnackbarMessage('Cart updated successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setSnackbarMessage('Error updating quantity');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteItem = async (maskId) => {
    try {
      const mask = masks.find(m => m.id === maskId);
      if (!mask) return;

      const updatedCart = cart.filter(item => item.id !== maskId);
      updateCart(updatedCart);

      // Update stock in the backend
      await updateMaskStock(maskId, mask.stock + 1);

      setSnackbarMessage('Item removed from cart');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbarMessage('Error removing item');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const calculateTax = () => {
    return (parseFloat(calculateSubtotal()) * 0.1).toFixed(2);
  };

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      // Update stock for all items in cart
      for (const item of cart) {
        const mask = masks.find(m => m.id === item.id);
        if (mask) {
          await updateMaskStock(item.id, mask.stock - item.quantity);
        }
      }

      // Clear the cart
      updateCart([]);

      setSnackbarMessage('Order placed successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during checkout:', error);
      setSnackbarMessage('Error during checkout');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Container maxWidth="xl" sx={{ 
        mt: 4, 
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, width: '100%' }}>
              <Typography variant="h4" gutterBottom align="center">
                Your Shopping Cart
              </Typography>
              {cart.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center">
                  Your cart is empty
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                  {cart.length} items in your cart
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            {cart.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Your cart is empty
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Continue Shopping
                </Button>
              </Paper>
            ) : (
              <Paper sx={{ p: 3 }}>
                <List>
                  {cart.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        py: 2,
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <CardMedia
                            component="img"
                            height="100"
                            image={item.image}
                            alt={item.name}
                            sx={{ objectFit: 'contain' }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6" align="center">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary" align="center">
                            {item.description}
                          </Typography>
                          <Typography variant="h6" color="primary" align="center">
                            ${item.price}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography>{item.quantity}</Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <AddIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>

          {cart.length > 0 && (
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom align="center">
                  Order Summary
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" align="center">
                    Subtotal: ${calculateSubtotal()}
                  </Typography>
                  <Typography variant="body1" align="center">
                    Tax: ${calculateTax()}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }} align="center">
                    Total: ${calculateTotal()}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Cart; 