import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, Chip, CircularProgress, Alert } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import axios from 'axios';

const OtherMasks = () => {
  const [masks, setMasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMasks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/masks');
        // Filter for ResMed masks (IDs 11-20)
        const resmedMasks = response.data.filter(mask => mask.id >= 11 && mask.id <= 20);
        setMasks(resmedMasks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch masks. Please try again later.');
        setLoading(false);
        console.error('Error fetching masks:', err);
      }
    };

    fetchMasks();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ResMed Masks for COPD
      </Typography>
      <Grid container spacing={3}>
        {masks.map((mask) => (
          <Grid item xs={12} sm={6} key={mask.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={mask.imageUrl}
                alt={mask.maskType}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {mask.maskType}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {mask.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={`Stock: ${mask.stock}`}
                    color={mask.stock > 10 ? 'success' : 'error'}
                    size="small"
                  />
                  <Typography variant="h6" color="primary">
                    ${mask.price}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<AddShoppingCart />}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OtherMasks; 