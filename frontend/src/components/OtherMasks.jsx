import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useMasks } from '../contexts/MaskContext';
import { MaskGrid } from './MaskGrid';

const OtherMasks = () => {
  const { masks, fetchMasks,loading } = useMasks();
  
  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        {/* Original OtherMasks content here */}
        <MaskGrid masks={masks}/>
      </Box>
    </Container>
  );
};

export default OtherMasks; 