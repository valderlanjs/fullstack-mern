// hooks/useLogo.js
import { useState, useEffect } from 'react';
import api from '../services/api';

const useLogo = () => {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogo = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logo/active');
      if (response.data.success) {
        setLogo(response.data.logo);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar logo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  return { logo, loading, error, refetch: fetchLogo };
};

export default useLogo;