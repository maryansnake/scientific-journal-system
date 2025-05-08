import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Rating,
  Divider
} from '@mui/material';

const ReviewCard = ({ review, onDelete, showActions = true }) => {
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

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Рецензія на "{review.manuscript?.title}"
          </Typography>
          
          <Chip
            label={review.recommendation}
            color={getRecommendationColor(review.recommendation)}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Рецензент: {review.reviewer?.name || 'Анонімний'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
          <Typography variant="body2" component="legend" mr={1}>
            Оцінка:
          </Typography>
          <Rating value={review.score} readOnly max={10} />
          <Typography variant="body2" ml={1}>
            ({review.score}/10)
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Typography variant="body1" paragraph>
          {review.content}
        </Typography>
        
        {review.comments && (
          <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 1, mt: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Коментарі для редактора:
            </Typography>
            <Typography variant="body2">
              {review.comments}
            </Typography>
          </Box>
        )}
        
        {review.isConfidential && (
          <Chip
            label="Конфіденційно"
            color="secondary"
            size="small"
            sx={{ mt: 2 }}
          />
        )}
      </CardContent>
      
      {showActions && (
        <CardActions>
          <Button size="small" component={RouterLink} to={`/reviews/${review._id}`}>
            Деталі
          </Button>
          
          <Button 
            size="small"
            component={RouterLink} 
            to={`/reviews/edit/${review._id}`}
          >
            Редагувати
          </Button>
          
          <Button 
            size="small" 
            color="error" 
            onClick={() => onDelete(review._id)}
          >
            Видалити
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ReviewCard;