import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useSnackbar } from '../contexts/SnackbarContext';

const MaskGrid = ({ masks, title }) => {
  const { addToCart } = useCart();
  const { showSnackbar } = useSnackbar();

  const handleAddToCart = async (mask) => {
    try {
      if (mask.stock <= 0) {
        showSnackbar('This item is out of stock', 'error');
        return;
      }

      // Add to cart first
      await addToCart({
        id: mask.id,
        name: mask.maskType,
        price: Number(mask.price),
        image: mask.imageUrl,
        stock: mask.stock
      });

      // Update stock on backend
      const response = await fetch(`http://localhost:4000/api/masks/${mask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          stock: mask.stock - 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      showSnackbar('Item added to cart successfully', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showSnackbar('Failed to add item to cart. Please try again.', 'error');
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {masks.map((mask) => (
          <Grid item key={mask.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="240"
                image={mask.imageUrl}
                alt={mask.maskType}
                sx={{ 
                  objectFit: 'contain',
                  bgcolor: '#f5f5f5',
                  p: 2
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {mask.maskType}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {mask.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${Number(mask.price).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color={mask.stock > 0 ? 'success.main' : 'error.main'}>
                    {mask.stock > 0 ? `${mask.stock} in stock` : 'Out of stock'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
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
    </Box>
  );
};

export default MaskGrid; 