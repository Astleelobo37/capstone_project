import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MaskContext = createContext();

export const useMasks = () => useContext(MaskContext);

export const MaskProvider = ({ children }) => {
  const [masks, setMasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/masks');
      setMasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch masks');
    } finally {
      setLoading(false);
    }
  };

  const updateMaskStock = async (maskId, newStock) => {
    try {
      await axios.put(`http://localhost:4000/api/masks/${maskId}/stock`, {
        stock: newStock
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state
      setMasks(prevMasks => 
        prevMasks.map(mask => 
          mask.id === maskId ? { ...mask, stock: newStock } : mask
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error updating mask stock:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchMasks();
  }, []);

  return (
    <MaskContext.Provider value={{ masks, loading, error, fetchMasks, updateMaskStock }}>
      {children}
    </MaskContext.Provider>
  );
}; 