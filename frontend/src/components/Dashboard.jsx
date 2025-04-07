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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

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
  const [masks, setMasks] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [cart, setCart] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { user } = useAuth();

  useEffect(() => {
    console.log('Dashboard useEffect triggered');
    
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
    
    console.log('Starting to fetch masks...');
    fetchMasks();
    console.log('Starting to fetch test results...');
    fetchTestResults(user.id);
  }, [user]);

  const fetchMasks = async () => {
    try {
      console.log('Making API call to /api/masks');
      const response = await axios.get('http://localhost:4000/api/masks');
      console.log('Masks API response status:', response.status);
      
      const data = response.data;
      console.log('Received masks data:', JSON.stringify(data, null, 2));
      
      if (!Array.isArray(data)) {
        console.error('Invalid data format:', typeof data);
        throw new Error('Expected array of masks but got: ' + typeof data);
      }
      
      if (data.length === 0) {
        console.log('No masks found in response');
        setError('No masks available at this time');
        return;
      }
      
      // Filter for non-ResMed masks (IDs 1-10)
      const filteredMasks = data.filter(mask => mask.id <= 10);
      setMasks(filteredMasks);
      setLoading(false);
      console.log('Successfully set masks state:', data.length, 'masks');
    } catch (err) {
      console.error('Error in fetchMasks:', err);
      setError('Failed to fetch masks: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const fetchTestResults = async (userId) => {
    if (!userId) {
      console.log('No user ID provided for test results');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No authentication token found');
      navigate('/login');
      return;
    }

    try {
      console.log('Making API call to /api/test-results/' + userId + '/latest');
      const response = await axios.get(`http://localhost:4000/api/test-results/${userId}/latest`, {
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

  const handleAddToCart = (mask) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === mask.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === mask.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...mask, quantity: 1 }];
    });
    setSnackbar({
      open: true,
      message: `${mask.maskType || mask.mask_type} added to cart!`
    });
  };

  const handleRemoveFromCart = (maskId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== maskId));
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
        message: 'Order placed successfully!'
      });
    } catch (err) {
      setError('Failed to place order: ' + err.message);
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
      fetchTestResults(user.id);
    } catch (err) {
      setError('Failed to upload test results');
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
    if (filterSeverity === 'all') return masks;
    return masks.filter(mask => {
      const maskSeverity = mask.description.match(/GOLD [1-4]/g);
      return maskSeverity && maskSeverity.some(s => s.includes(filterSeverity));
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #4CAF50 90%)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Healthcare Portal
          </Typography>
          {testResults && (
            <Chip
              label={testResults.status}
              sx={{
                bgcolor: severityColors[testResults.status],
                color: 'white',
                mr: 2
              }}
            />
          )}
          <Button
            color="inherit"
            startIcon={<UploadFileIcon />}
            onClick={() => setOpenUpload(true)}
            sx={{ mr: 2 }}
          >
            Upload Results
          </Button>
          <Badge badgeContent={cart.length} color="error">
            <Button
              color="inherit"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate('/cart')}
              sx={{ mr: 2 }}
            >
              View Cart
            </Button>
          </Badge>
          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {user?.name}
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => navigate('/cart')}>
              <Badge badgeContent={cart.length} color="error">
                <ShoppingCartIcon sx={{ mr: 1 }} />
              </Badge>
              Cart
            </MenuItem>
            <MenuItem onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Severity</InputLabel>
            <Select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filterMasksBySeverity(masks).map((mask) => (
            <div 
              key={mask.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-[500px] flex flex-col"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={mask.imageUrl} 
                  alt={mask.maskType}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{mask.maskType}</h2>
                <p className="text-gray-600 mb-4 flex-grow">{mask.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-blue-600">${mask.price.toFixed(2)}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    mask.stock > 50 ? 'bg-green-100 text-green-800' : 
                    mask.stock > 20 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {mask.stock > 50 ? 'In Stock' : mask.stock > 20 ? 'Low Stock' : 'Limited Stock'}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(mask)}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
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