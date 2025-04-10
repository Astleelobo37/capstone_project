import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#ff0000',
        color: 'white',
        py: 4,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
          © {new Date().getFullYear()} Healthcare Portal. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 