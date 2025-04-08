import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { UploadFile as UploadFileIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const UploadResults = () => {
  const { user } = useAuth();
  const [uploadFile, setUploadFile] = useState(null);
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('userId', user.id);
    formData.append('severity', severity);

    try {
      const response = await axios.post('http://localhost:4000/api/test-results/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setUploadFile(null);
        setSeverity('');
        setSnackbar({
          open: true,
          message: 'Test results uploaded successfully',
          severity: 'success'
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Error uploading test results:', err);
      setError('Failed to upload test results: ' + (err.response?.data?.message || err.message));
      setSnackbar({
        open: true,
        message: 'Failed to upload test results',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Upload Test Results
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Upload your latest test results to get personalized mask recommendations
        </Typography>

        <Box component="form" onSubmit={handleUpload} sx={{ maxWidth: 500, mx: 'auto' }}>
          <TextField
            type="file"
            fullWidth
            onChange={(e) => setUploadFile(e.target.files[0])}
            sx={{ mb: 3 }}
            required
          />
          <FormControl fullWidth sx={{ mb: 3 }}>
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
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<UploadFileIcon />}
            onClick={handleUpload}
            disabled={!uploadFile || !severity || loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Upload Results'}
          </Button>
        </Box>
      </Paper>

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

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default UploadResults; 