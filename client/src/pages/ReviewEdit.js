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

const ReviewEdit = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const { addAlert } = useContext(AlertContext);
  
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await api.get(`/api/v1/reviews/${reviewId}`);
        setReview(res.data.data);
      } catch (err) {
        addAlert('Помилка завантаження даних рецензії', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId, addAlert, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await api.put(`/api/v1/reviews/${reviewId}`, formData);
      addAlert('Рецензію успішно оновлено', 'success');
      navigate(`/reviews/${reviewId}`);
    } catch (err) {
      addAlert(err.response?.data?.message || 'Помилка оновлення рецензії', 'error');
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
        onClick={() => navigate(`/reviews/${reviewId}`)}
        sx={{ mb: 2 }}
      >
        Назад до рецензії
      </Button>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Редагування рецензії
        </Typography>
        <Typography variant="h6" gutterBottom>
          {review.manuscript.title}
        </Typography>
        <Typography variant="body1" paragraph>
          Автор: {review.manuscript.author.name}
        </Typography>
      </Paper>
      
      <ReviewForm 
        initialData={review}
        onSubmit={handleSubmit} 
        loading={submitting}
        isEditMode={true}
      />
    </Container>
  );
};

export default ReviewEdit;