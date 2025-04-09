import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Container,
  Paper,
  CardActions
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useMasks } from '../contexts/MaskContext';
import { useCart } from '../contexts/CartContext';

const OtherMasks = () => {
  const { user } = useAuth();
  const { masks, loading: masksLoading, error: masksError, fetchMasks } = useMasks();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchMasks();
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    loadData();
  }, [fetchMasks]);

  // Filter for ResMed masks (IDs 11-20)
  const filteredMasks = masks.filter(mask => mask.id >= 11 && mask.id <= 20);

  const handleAddToCart = async (mask) => {
    if (mask.stock <= 0) {
      setSnackbar({
        open: true,
        message: 'This item is out of stock',
        severity: 'error'
      });
      return;
    }

    try {
      // First add to cart to ensure the item is properly formatted
      const cartItem = {
        id: mask.id,
        maskType: mask.maskType,
        description: mask.description,
        imageUrl: mask.imageUrl,
        price: Number(mask.price),
        stock: mask.stock
    };
      addToCart(cartItem);

      // Then update stock on backend
      await axios.put(`http://localhost:4000/api/masks/${mask.id}/stock`, {
        stock: mask.stock - 1
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Refresh masks data instead of updating local state
      await fetchMasks();

      setSnackbar({
        open: true,
        message: `${mask.name} added to cart`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error in handleAddToCart:', err);
      if (err.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Please log in to add items to cart',
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to add item to cart. Please try again.',
          severity: 'error'
        });
      }
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Other Masks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse our collection of other mask options
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            {filteredMasks.map((mask) => (
              <Grid item key={mask.id} size={{xs:12,sm:6,md:4,lg:3}}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={mask.image}
                    alt={mask.name}
                    sx={{ objectFit: 'contain', p: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {mask.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mask.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${mask.price}
                    </Typography>
                    <Typography variant="body2" color={mask.stock > 0 ? 'success.main' : 'error.main'}>
                      {mask.stock > 0 ? `${mask.stock} in stock` : 'Out of stock'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleAddToCart(mask)}
                      disabled={mask.stock <= 0}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
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
  );
};

export default OtherMasks; 