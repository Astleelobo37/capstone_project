import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)'
  }
}));

const StyledLockIcon = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    color: '#fff',
    fontSize: '2rem'
  },
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)'
  }
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2)
  }
}));

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    NHI: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNHI, setResetNHI] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState('NHI'); // 'NHI' or 'password'
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }

    if (loginMethod === 'NHI') {
      if (!formData.NHI) {
        setError('NHI number is required');
        return false;
      }
      if (!/^NHI\d{7}$/.test(formData.NHI)) {
        setError('NHI must be in format NHI followed by 7 digits');
        return false;
      }
    } else {
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Attempting login with:', {
        email: formData.email,
        NHI: loginMethod === 'NHI' ? formData.NHI : undefined,
        password: loginMethod === 'password' ? formData.password : undefined
      });

      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email: formData.email,
        NHI: loginMethod === 'NHI' ? formData.NHI : undefined,
        password: loginMethod === 'password' ? formData.password : undefined
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        login(response.data.user);
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail || !resetNHI) {
      setError('Email and NHI are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/auth/reset-password', {
        email: resetEmail,
        NHI: resetNHI
      });

      if (response.data.success) {
        setSuccessMessage('Password reset instructions have been sent to your email');
        setOpenForgotPassword(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process password reset request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <StyledPaper elevation={6}>
        <StyledLockIcon>
          <LockOutlinedIcon />
        </StyledLockIcon>
        <Typography component="h1" variant="h4" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
          Patient Login
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Button
            variant={loginMethod === 'NHI' ? 'contained' : 'outlined'}
            onClick={() => setLoginMethod('NHI')}
            sx={{ mr: 1 }}
          >
            Login with NHI
          </Button>
          <Button
            variant={loginMethod === 'password' ? 'contained' : 'outlined'}
            onClick={() => setLoginMethod('password')}
          >
            Login with Password
          </Button>
        </Box>

        <Form onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="email"
          />

          {loginMethod === 'NHI' ? (
            <TextField
              variant="outlined"
              required
              fullWidth
              label="NHI Number"
              name="NHI"
              value={formData.NHI}
              onChange={handleInputChange}
              autoComplete="off"
              helperText="Format: NHI followed by 7 digits"
            />
          ) : (
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => setOpenForgotPassword(true)}
            >
              Forgot password?
            </Link>
          </Box>
        </Form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Dialog open={openForgotPassword} onClose={() => setOpenForgotPassword(false)}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              label="NHI Number"
              fullWidth
              value={resetNHI}
              onChange={(e) => setResetNHI(e.target.value)}
              helperText="Format: NHI followed by 7 digits"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForgotPassword(false)}>Cancel</Button>
            <Button onClick={handleForgotPassword} color="primary">
              Reset Password
            </Button>
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </Container>
  );
};

export default Login; 