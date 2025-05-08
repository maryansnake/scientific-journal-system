import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AlertContext } from '../context/AlertContext';
import api from '../utils/api';
import ReviewForm from '../components/reviews/ReviewForm';

const ReviewNew = () => {
  const { manuscriptId } = useParams();
  const navigate = useNavigate();
  const { addAlert } = useContext(AlertContext);
  
  const [manuscript, setManuscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchManuscript = async () => {
      try {
        const res = await api.get(`/api/v1/manuscripts/${manuscriptId}`);
        setManuscript(res.data.data);
      } catch (err) {
        addAlert('Помилка завантаження даних рукопису', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchManuscript();
  }, [manuscriptId, addAlert, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await api.post(`/api/v1/manuscripts/${manuscriptId}/reviews`, formData);
      addAlert('Рецензію успішно створено', 'success');
      navigate(`/manuscripts/${manuscriptId}`);
    } catch (err) {
      addAlert(err.response?.data?.message || 'Помилка створення рецензії', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/manuscripts/${manuscriptId}`)}
        sx={{ mb: 2 }}
      >
        Назад до рукопису
      </Button>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Рецензування рукопису
        </Typography>
        <Typography variant="h6" gutterBottom>
          {manuscript.title}
        </Typography>
        <Typography variant="body1" paragraph>
          Автор: {manuscript.author.name}
        </Typography>
      </Paper>
      
      <ReviewForm onSubmit={handleSubmit} loading={submitting} />
    </Container>
  );
};

export default ReviewNew;