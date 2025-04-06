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
  Select
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6]
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const {currentUser} = useUserContext()

  useEffect(() => {
    console.log('Dashboard useEffect triggered');
    
    
    if (!currentUser) {
      console.log('No user data found, redirecting to login');
      navigate('/login');
      return;
    }
    
    
    console.log('Starting to fetch masks...');
    fetchMasks();
    console.log('Starting to fetch test results...');
    fetchTestResults(currentUser.id);
  }, []);

  const fetchMasks = async () => {
    try {
      console.log('Making API call to /api/masks');
      const response = await fetch('/api/masks');
      console.log('Masks API response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received masks data:', data);
      if (!Array.isArray(data)) {
        throw new Error('Expected array of masks but got:', typeof data);
      }
      setMasks(data);
    } catch (err) {
      console.error('Error in fetchMasks:', err);
      setError('Failed to fetch masks: ' + err.message);
    }
  };

  const fetchTestResults = async (userId) => {
    if (!userId) {
      console.log('No user ID provided for test results');
      return;
    }
    try {
      console.log('Making API call to /api/test-results/' + userId + '/latest');
      const response = await fetch(`/api/test-results/${userId}/latest`,{
        headers: {
          "authorization":`token ${currentUser.token}`,
        },
      });
      console.log('Test results API response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received test results data:', data);
      setTestResults(data);
      setSeverity(data.status);
    } catch (err) {
      console.error('Error in fetchTestResults:', err);
      setError('Failed to fetch test results: ' + err.message);
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
      const response = await fetch('/api/test-results/upload', {
        method: 'POST',
        body: formData
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
                {currentUser?.name}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
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

        <Grid container spacing={3}>
          {filterMasksBySeverity(masks).map((mask) => (
            <Grid item xs={12} sm={6} md={4} key={mask.id}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={mask.imageUrl || 'https://images.unsplash.com/photo-1623152108147-ca707f703325?w=800&auto=format&fit=crop'}
                  alt={mask.maskType || mask.mask_type}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {mask.maskType || mask.mask_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {mask.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip
                      label={`Stock: ${mask.stock}`}
                      color={mask.stock > 10 ? 'success' : 'error'}
                      size="small"
                    />
                    <Typography variant="h6" color="primary">
                      ${mask.price}
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
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