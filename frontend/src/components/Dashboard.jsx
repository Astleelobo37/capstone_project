import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  AppBar,
  Toolbar,
  Button,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Badge,
  Snackbar,
  CircularProgress,
  CardActions,
  Stack,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useMasks } from '../contexts/MaskContext';
import { useCart } from '../contexts/CartContext';
import MaskGrid from './MaskGrid';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8]
  }
}));

const severityColors = {
  'GOLD 1 - Mild': '#4CAF50',
  'GOLD 2 - Moderate': '#FFC107',
  'GOLD 3 - Severe': '#FF9800',
  'GOLD 4 - Very Severe': '#F44336'
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading: masksLoading, error: masksError } = useMasks();
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [masks, setMasks] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Only fetch test results if user is authenticated
        if (user && localStorage.getItem('token')) {
          await fetchTestResults();
        await fetchMasks();
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const fetchTestResults = async () => {
        try {
      const response = await axios.get(`/api/test-results/${user.id}/latest`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.data) {
        setTestResults(response.data);
      }
    } catch (err) {
      console.error('Error fetching test results:', err);
      // Don't set error state for test results failure as it's not critical
    }
  };

  const fetchMasks = async () => {

    try {
      const response = await axios.get(`/api/masks`);
      
      if (response.data) {
        setMasks(response.data);
      }
    } catch (err) {
      console.error('Error fetching test results:', err);
      // Don't set error state for test results failure as it's not critical
    }
  };

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
      // Update local state
      const updatedMasks = masks.map(m => 
          m.id === mask.id ? { ...m, stock: m.stock - 1 } : m
      );
      setMasks(updatedMasks);
      
      // Add to cart
      addToCart(mask);

      setSnackbar({
        open: true,
        message: `${mask.maskType} added to cart`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      setSnackbar({
        open: true,
        message: 'Failed to add item to cart. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleRemoveFromCart = async (maskId) => {
    const itemToRemove = cart.find(item => item.id === maskId);
    if (!itemToRemove) return;

    const updatedCart = cart.filter(item => item.id !== maskId);
    
    try {
      // Update stock on backend
      await axios.put(`/api/masks/${maskId}/stock`, {
        stock: itemToRemove.stock + itemToRemove.quantity
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setSnackbar({
        open: true,
        message: 'Item removed from cart',
        severity: 'info'
      });
    } catch (err) {
      console.error('Error updating stock:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update stock',
        severity: 'error'
      });
    }
  };

  const handleUpdateQuantity = (maskId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(maskId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === maskId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post('/api/orders', {
        userId: user.id,
        items: cart,
        total: calculateTotal()
      }, {
        headers: {
          'authorization': `token ${user.token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      setCart([]);
      setSnackbar({
        open: true,
        message: 'Order placed successfully!',
        severity: 'success'
      });
    } catch (err) {
      setError('Failed to place order: ' + err.message);
      setSnackbar({
        open: true,
        message: 'Failed to place order',
        severity: 'error'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filterMasksBySeverity = (masks) => {
    if (filter === 'all') return masks;
    return masks.filter(mask => {
      const maskSeverity = mask.description.match(/GOLD [1-4]/g);
      return maskSeverity && maskSeverity.some(s => s.includes(filter));
    });
  };

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
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
            Breathe Easier, Live Better
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            Get your prescribed COPD respiratory equipment delivered directly to your home in as little as 2 weeks.
          </Typography>
        </Container>
      </Box>

      {/* How It Works */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 6, fontWeight: 600 }}>
          How We Work!
        </Typography>
        <Box sx={{ position: 'relative' }}>
          {/* Vertical line connecting steps */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: '20px', md: '50%' },
              transform: { xs: 'none', md: 'translateX(-50%)' },
              top: '40px',
              bottom: '40px',
              width: '2px',
              bgcolor: 'primary.main',
              opacity: 0.3
            }}
          />
          <Grid container spacing={4} direction="column">
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 4, 
                  position: 'relative',
                  ml: { xs: 6, md: 0 },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
                elevation={3}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    left: { xs: -24, md: '50%' },
                    transform: { xs: 'none', md: 'translateX(-50%)' },
                    top: { xs: '50%', md: -24 },
                    marginTop: { xs: '-24px', md: 0 },
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    zIndex: 1
                  }}
                >
                  1
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Prescription Upload
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', margin: '0 auto' }}>
                    Upload your doctor's prescription for respiratory equipment and our team will verify it.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 4, 
                  position: 'relative',
                  ml: { xs: 6, md: 0 },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
                elevation={3}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    left: { xs: -24, md: '50%' },
                    transform: { xs: 'none', md: 'translateX(-50%)' },
                    top: { xs: '50%', md: -24 },
                    marginTop: { xs: '-24px', md: 0 },
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    zIndex: 1
                  }}
                >
                  2
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Virtual Fitting
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', margin: '0 auto' }}>
                    Use our virtual app to get the perfect fit for your mask without leaving home.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 4, 
                  position: 'relative',
                  ml: { xs: 6, md: 0 },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
                elevation={3}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    left: { xs: -24, md: '50%' },
                    transform: { xs: 'none', md: 'translateX(-50%)' },
                    top: { xs: '50%', md: -24 },
                    marginTop: { xs: '-24px', md: 0 },
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    zIndex: 1
                  }}
                >
                  3
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Fast Delivery
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', margin: '0 auto' }}>
                    Receive your equipment at your doorstep within 2 weeks, with full setup instructions.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Statistics */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" gutterBottom>200k+</Typography>
                <Typography variant="body2">New Zealanders with COPD</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" gutterBottom>75%</Typography>
                <Typography variant="body2">Equipment to Your Door</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" gutterBottom>20%</Typography>
                <Typography variant="body2">Faster Hospital Admission</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" gutterBottom>90%</Typography>
                <Typography variant="body2">Patient Satisfaction</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Equipment Section */}
      <Container maxWidth="xl">
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
          Equipment We Provide
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Severity</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter by Severity"
            >
              <MenuItem value="all">All Masks</MenuItem>
              <MenuItem value="1">GOLD 1 - Mild</MenuItem>
              <MenuItem value="2">GOLD 2 - Moderate</MenuItem>
              <MenuItem value="3">GOLD 3 - Severe</MenuItem>
              <MenuItem value="4">GOLD 4 - Very Severe</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {filterMasksBySeverity(masks).map((mask) => (
            <Grid item key={mask.id} size={{xs:12,sm:6,md:4,lg:3}}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={mask.imageUrl}
                  alt={mask.maskType}
                  sx={{ objectFit: 'contain', p: 1 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {mask.maskType}
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

        <MaskGrid 
          masks={fisherPaykelMasks} 
          title="Fisher & Paykel Masks" 
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

      {error && (
        <Alert
          severity="error"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 2000
          }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard; 