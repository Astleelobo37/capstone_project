import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useMasks } from '../contexts/MaskContext';
import MaskGrid from './MaskGrid';

const OtherMasks = () => {
  const { masks, fetchMasks } = useMasks();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMasks = async () => {
      try {
        await fetchMasks();
        setLoading(false);
      } catch (error) {
        console.error('Error loading masks:', error);
        setLoading(false);
      }
    };

    loadMasks();
  }, [fetchMasks]);

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
        <MaskGrid masks={masks} title="Other Masks" />
      </Box>
    </Container>
  );
};

export default OtherMasks; 