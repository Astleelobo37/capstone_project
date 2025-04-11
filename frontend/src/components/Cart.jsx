import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon, CheckCircleOutline } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DeliveryAddressForm from './DeliveryAddressForm';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';


const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [successDialog, setSuccessDialog] = useState(false);

  const handleCheckout = async () => {
    if (!deliveryAddress || !paymentDetails) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    try {
      const orderData = {
        items: cart,
        total: getTotalPrice(),
        deliveryAddress,
        paymentDetails: {
          cardNumber: paymentDetails.cardNumber.slice(-4),
          cardHolder: paymentDetails.cardHolder,
          expiryDate: paymentDetails.expiryDate
        }
      };
      
      // Show success dialog
      setSuccessDialog(true);
      
      // Close dialog, logout, and navigate after 10 seconds
      setTimeout(async () => {
        setSuccessDialog(false);
        try {
          await logout();
          navigate('/login');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      }, 10000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to process checkout. Please try again.',
        severity: 'error'
      });
    }
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/dashboard')}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }
  console.log(cart)

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#2196f3', fontWeight: 600, mb: 3 }}>
        Shopping Cart
      </Typography>
      
      <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2196f3' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Product</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Price</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Quantity</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Total</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 50, height: 50, marginRight: 16, objectFit: 'contain' }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: '#2196f3', fontWeight: 500 }}>${Number(item.price).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      sx={{ color: '#2196f3' }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2, fontWeight: 500 }}>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      sx={{ color: '#2196f3' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: '#2196f3', fontWeight: 500 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3, boxShadow: 3 }}>
            <DeliveryAddressForm onAddressChange={setDeliveryAddress} />
          </Paper>
          <Paper sx={{ p: 3, mb: 3, boxShadow: 3 }}>
            <PaymentForm onPaymentChange={setPaymentDetails} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <OrderSummary subtotal={getTotalPrice()} />
          <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCheckout}
              sx={{ 
                py: 1.5, 
                fontSize: '1.1rem',
                fontWeight: 600,
                backgroundColor: '#2196f3',
                '&:hover': {
                  backgroundColor: '#1976d2'
                }
              }}
            >
              Complete Checkout
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={successDialog}
        aria-labelledby="order-success-dialog"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            padding: 2,
            minWidth: 300
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#2196f3' }}>
          <CheckCircleOutline sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Order Confirmed!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
            Thank you for your purchase!
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
            Your order details and receipt will be emailed to you shortly.
          </Typography>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart; 