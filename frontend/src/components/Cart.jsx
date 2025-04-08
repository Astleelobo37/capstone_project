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
import { useMasks } from '../contexts/MaskContext';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const { masks, loading: masksLoading, error: masksError, fetchMasks } = useMasks();
  const [cart, setCart] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchMasks();
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    loadData();
  }, [fetchMasks]);

  const handleQuantityChange = async (maskId, newQuantity) => {
    try {
      const mask = masks.find(m => m.id === maskId);
      if (!mask) return;

      if (newQuantity < 1) {
        handleDeleteItem(maskId);
        return;
      }

      if (newQuantity > mask.stock) {
        setSnackbar({
          open: true,
          message: 'Not enough stock available',
          severity: 'error'
        });
        return;
      }

      const updatedCart = cart.map(item => 
        item.id === maskId ? { ...item, quantity: newQuantity } : item
      );

      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setSnackbar({
        open: true,
        message: 'Cart updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      setSnackbar({
        open: true,
        message: 'Error updating quantity',
        severity: 'error'
      });
    }
  };

  const handleDeleteItem = async (maskId) => {
    try {
      const mask = masks.find(m => m.id === maskId);
      if (!mask) return;

      const updatedCart = cart.filter(item => item.id !== maskId);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      // Update stock in the backend
      await axios.put(`http://localhost:4000/api/masks/${maskId}/stock`, {
        stock: mask.stock + 1
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSnackbar({
        open: true,
        message: 'Item removed from cart',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbar({
        open: true,
        message: 'Error removing item',
        severity: 'error'
      });
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
          await axios.put(`http://localhost:4000/api/masks/${item.id}/stock`, {
            stock: mask.stock - item.quantity
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        }
      }

      // Clear the cart
      setCart([]);
      localStorage.removeItem('cart');

      setSnackbar({
        open: true,
        message: 'Order placed successfully!',
        severity: 'success'
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during checkout:', error);
      setSnackbar({
        open: true,
        message: 'Error during checkout',
        severity: 'error'
      });
    }
  };

  if (masksLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (masksError) {
    return (
      <Box p={3}>
        <Alert severity="error">{masksError}</Alert>
      </Box>
    );
  }

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
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Cart; 