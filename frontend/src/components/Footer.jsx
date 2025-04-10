import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2196f3',
        color: 'white',
        width: '100%',
        mt: 'auto',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Healthcare Portal
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>
              Your trusted source for quality healthcare equipment and supplies. We are committed to providing the best products and service to our healthcare professionals.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: 'white' }} aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'white' }} aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'white' }} aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'white' }} aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
                About Us
              </Link>
              <Link href="/products" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
                Products
              </Link>
              <Link href="/faq" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
                FAQ
              </Link>
              <Link href="/contact" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Products */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Products
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/masks" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
                Medical Masks
              </Link>
              <Link href="/equipment" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
                Medical Equipment
              </Link>
              <Link href="/supplies" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
                Medical Supplies
              </Link>
              <Link href="/new-arrivals" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
                New Arrivals
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: 'white' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: 'white' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  support@healthcareportal.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: 'white' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  123 Healthcare Ave, Medical District
                  <br />
                  Auckland, New Zealand
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            © {new Date().getFullYear()} Healthcare Portal. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
              Privacy Policy
            </Link>
            <Link href="/terms" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
              Terms of Service
            </Link>
            <Link href="/shipping" sx={{ color: 'rgba(255, 255, 255, 0.9)', '&:hover': { color: 'white' } }}>
              Shipping Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 