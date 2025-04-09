import React, { useState } from "react";
import { Paper, Typography, Grid, TextField, Box } from "@mui/material";

const DeliveryAddressForm = ({ onAddressChange }) => {
  const [address, setAddress] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedAddress = {
      ...address,
      [name]: value,
    };
    setAddress(updatedAddress);
    onAddressChange(updatedAddress);
  };

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ color: '#2196f3', fontWeight: 600, mb: 3 }}>
        Delivery Address
      </Typography>
      <Box component="form">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
              required
              sx={{
                '& label.Mui-focused': {
                  color: '#2196f3',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              name="streetAddress"
              value={address.streetAddress}
              onChange={handleChange}
              required
              sx={{
                '& label.Mui-focused': {
                  color: '#2196f3',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={address.city}
              onChange={handleChange}
              required
              sx={{
                '& label.Mui-focused': {
                  color: '#2196f3',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={address.state}
              onChange={handleChange}
              required
              sx={{
                '& label.Mui-focused': {
                  color: '#2196f3',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              required
              sx={{
                '& label.Mui-focused': {
                  color: '#2196f3',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              required
              sx={{
                '& label.Mui-focused': {
                  color: '#2196f3',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DeliveryAddressForm;
