import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Rating,
  Divider,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import api from '../utils/api';

const ReviewDetail = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await api.get(`/api/v1/reviews/${reviewId}`);
        setReview(res.data.data);
      } catch (err) {
        addAlert('Помилка завантаження рецензії', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId, addAlert, navigate]);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/v1/reviews/${reviewId}`);
      addAlert('Рецензію успішно видалено', 'success');
      navigate('/dashboard');
    } catch (err) {
      addAlert('Помилка видалення рецензії', 'error');
    }
    setDeleteDialogOpen(false);
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'Прийняти без змін':
        return 'success';
      case 'Прийняти з незначними змінами':
        return 'info';
      case 'Переробити та надіслати повторно':
        return 'warning';
      case 'Відхилити':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Перевірка прав доступу (автор рецензії або адміністратор)
  const canEdit = user.id === review.reviewer._id || user.role === 'admin';

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/manuscripts/${review.manuscript._id}`)}
        sx={{ mb: 2 }}
      >
        Назад до рукопису
      </Button>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Рецензія на рукопис
          </Typography>
          
          <Chip
            label={review.recommendation}
            color={getRecommendationColor(review.recommendation)}
          />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          {review.manuscript.title}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Рецензент:
          </Typography>
          <Typography variant="body1">
            {review.reviewer.name}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Дата створення:
          </Typography>
          <Typography variant="body1">
            {new Date(review.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary" mr={1}>
            Оцінка:
          </Typography>
          <Rating value={review.score} readOnly max={10} />
          <Typography variant="body1" ml={1}>
            ({review.score}/10)
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Текст рецензії:
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          {review.content}
        </Typography>
        
        {review.comments && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Коментарі для редактора:
            </Typography>
            <Typography variant="body1">
              {review.comments}
            </Typography>
          </Paper>
        )}
        
        {review.isConfidential && (
          <Chip
            label="Конфіденційно"
            color="secondary"
            size="small"
            sx={{ mb: 3 }}
          />
        )}
        
        {canEdit && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              component={RouterLink}
              to={`/reviews/edit/${reviewId}`}
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{ mr: 2 }}
            >
              Редагувати
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Видалити
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Діалог підтвердження видалення */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити цю рецензію? Ця дія не може бути скасована.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Скасувати</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewDetail;