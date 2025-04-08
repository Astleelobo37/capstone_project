import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { MaskProvider } from './contexts/MaskContext';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import OtherMasks from './components/OtherMasks';
import Cart from './components/Cart';
import PrivateRoute from './components/PrivateRoute';
import Chat from './components/Chat';
import UploadResults from './components/UploadResults';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#4CAF50',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width: 600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
          '@media (min-width: 900px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MaskProvider>
          <Router>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh',
              width: '100%'
            }}>
              <Header />
              <Box component="main" sx={{ 
                flexGrow: 1, 
                width: '100%',
                overflow: 'auto'
              }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/other-masks"
                    element={
                      <PrivateRoute>
                        <OtherMasks />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/upload-results"
                    element={
                      <PrivateRoute>
                        <UploadResults />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Box>
              <Chat />
            </Box>
          </Router>
        </MaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
