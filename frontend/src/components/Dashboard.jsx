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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Badge,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useMasks } from '../contexts/MaskContext';

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
  const { masks, loading: masksLoading, error: masksError, fetchMasks, updateMaskStock, cart, updateCart } = useMasks();
  const [testResults, setTestResults] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchMasks();
        await fetchTestResults();
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          updateCart(JSON.parse(savedCart));
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchMasks, updateCart]);

  const fetchTestResults = async () => {
    if (!user) {
      console.log('No user data found, redirecting to login');
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      console.log('Making API call to /api/test-results/' + user.id + '/latest');
      const response = await axios.get(`http://localhost:4000/api/test-results/${user.id}/latest`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      console.log('Test results API response status:', response.status);
      if (response.status === 401) {
        console.log('Unauthorized access, redirecting to login');
        navigate('/login');
        return;
      }
      
      console.log('Received test results data:', response.data);
      setTestResults(response.data);
      setSeverity(response.data.status);
    } catch (err) {
      console.error('Error in fetchTestResults:', err);
      setError('Failed to fetch test results: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddToCart = async (mask) => {
    try {
      if (mask.stock <= 0) {
        setSnackbarMessage('This item is out of stock');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      // Check if item already exists in cart
      const existingItem = cart.find(item => item.id === mask.id);
      if (existingItem) {
        if (existingItem.quantity >= mask.stock) {
          setSnackbarMessage('Not enough stock available');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }
        const updatedCart = cart.map(item =>
          item.id === mask.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updatedCart);
      } else {
        updateCart([...cart, { ...mask, quantity: 1 }]);
      }

      // Update stock in the backend
      await updateMaskStock(mask.id, mask.stock - 1);

      setSnackbarMessage('Item added to cart');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbarMessage('Error adding to cart');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleRemoveFromCart = async (maskId) => {
    const itemToRemove = cart.find(item => item.id === maskId);
    if (!itemToRemove) return;

    const updatedCart = cart.filter(item => item.id !== maskId);
    
    try {
      // Update stock on backend
      await axios.put(`http://localhost:4000/api/masks/${maskId}/stock`, {
        stock: itemToRemove.stock + itemToRemove.quantity
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      updateCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setSnackbarMessage('Item removed from cart');
      setSnackbarSeverity('info');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error updating stock:', err);
      setSnackbarMessage('Failed to update stock');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleUpdateQuantity = (maskId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(maskId);
      return;
    }
    updateCart(prevCart =>
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

      updateCart([]);
      setSnackbarMessage('Order placed successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (err) {
      setError('Failed to place order: ' + err.message);
      setSnackbarMessage('Failed to place order');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('userId', user.id);
    formData.append('severity', severity);

    try {
      const response = await axios.post('/api/test-results/upload', formData, {
        headers: {
          'authorization': `token ${user.token}`
        },
      });

      if (!response.ok) throw new Error('Upload failed');

      setOpenUpload(false);
      fetchTestResults();
    } catch (err) {
      setError('Failed to upload test results');
      setSnackbarMessage('Failed to upload test results');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
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

  // Filter for non-ResMed masks (IDs 1-10)
  const filteredMasks = masks.filter(mask => mask.id <= 10);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container sx={{ mt: 4, mb: 4 }}>
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
          {filteredMasks.map((mask) => (
            <Grid item xs={12} sm={6} md={4} key={mask.id}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={mask.imageUrl}
                  alt={mask.maskType}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {mask.maskType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {mask.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={`Stock: ${mask.stock}`}
                      color={mask.stock > 10 ? 'success' : 'error'}
                    />
                    <Typography variant="h6" color="primary">
                      ${mask.price}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAddToCart(mask)}
                    >
                      Add to Cart
                    </Button>
                    {cart.some(item => item.id === mask.id) && (
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveFromCart(mask.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
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

      {/* Upload Results Dialog */}
      <Dialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <DialogTitle>Upload Test Results</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpload} sx={{ mt: 2 }}>
            <TextField
              type="file"
              fullWidth
              onChange={(e) => setUploadFile(e.target.files[0])}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>COPD Severity</InputLabel>
              <Select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                label="COPD Severity"
                required
              >
                <MenuItem value="GOLD 1 - Mild">GOLD 1 - Mild</MenuItem>
                <MenuItem value="GOLD 2 - Moderate">GOLD 2 - Moderate</MenuItem>
                <MenuItem value="GOLD 3 - Severe">GOLD 3 - Severe</MenuItem>
                <MenuItem value="GOLD 4 - Very Severe">GOLD 4 - Very Severe</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!uploadFile || !severity || loading}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

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