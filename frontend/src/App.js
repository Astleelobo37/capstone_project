import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import OtherMasks from './components/OtherMasks';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function App() {
  return (
    <>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#fff'
        }}
      >
        <AuthProvider>
          <CartProvider>
            <Router>
              <Navbar />
              <Container 
                component="main" 
                maxWidth={false}
                sx={{ 
                  flex: '1 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  pt: 3,
                  pb: 6,
                  px: { xs: 2, sm: 3 }
                }}
              >
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                  <Route path="/other-masks" element={<PrivateRoute><OtherMasks /></PrivateRoute>} />
                </Routes>
              </Container>
              <Footer />
            </Router>
          </CartProvider>
        </AuthProvider>
      </Box>
    </>
  );
}

export default App; 