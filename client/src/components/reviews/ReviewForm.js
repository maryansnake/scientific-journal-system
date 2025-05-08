import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  TextField,
  Typography
} from '@mui/material';

const ReviewForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading, 
  isEditMode = false 
}) => {
  const [formData, setFormData] = useState({
    content: initialData.content || '',
    score: initialData.score || 5,
    recommendation: initialData.recommendation || '',
    comments: initialData.comments || '',
    isConfidential: initialData.isConfidential || false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRatingChange = (_, newValue) => {
    setFormData({
      ...formData,
      score: newValue
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEditMode ? 'Редагування рецензії' : 'Нова рецензія'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          multiline
          rows={6}
          label="Текст рецензії"
          name="content"
          value={formData.content}
          onChange={handleChange}
        />
        
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography component="legend">Оцінка рукопису (від 1 до 10)</Typography>
          <Rating
            name="score"
            value={formData.score}
            onChange={handleRatingChange}
            max={10}
          />
        </Box>
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="recommendation-label">Рекомендація</InputLabel>
          <Select
            labelId="recommendation-label"
            name="recommendation"
            value={formData.recommendation}
            onChange={handleChange}
            label="Рекомендація"
          >
            <MenuItem value="Прийняти без змін">Прийняти без змін</MenuItem>
            <MenuItem value="Прийняти з незначними змінами">
              Прийняти з незначними змінами
            </MenuItem>
            <MenuItem value="Переробити та надіслати повторно">
              Переробити та надіслати повторно
            </MenuItem>
            <MenuItem value="Відхилити">Відхилити</MenuItem>
          </Select>
          <FormHelperText>
            Оберіть рекомендацію щодо рукопису
          </FormHelperText>
        </FormControl>
        
        <TextField
          margin="normal"
          fullWidth
          multiline
          rows={3}
          label="Коментарі для редактора"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          helperText="Ці коментарі будуть видимі тільки для редакторів"
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="confidential-label">Конфіденційність</InputLabel>
          <Select
            labelId="confidential-label"
            name="isConfidential"
            value={formData.isConfidential}
            onChange={handleChange}
            label="Конфіденційність"
          >
            <MenuItem value={false}>Показувати автору</MenuItem>
            <MenuItem value={true}>Тільки для редактора</MenuItem>
          </Select>
          <FormHelperText>
            Виберіть, хто може бачити цю рецензію
          </FormHelperText>
        </FormControl>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Збереження...' : isEditMode ? 'Оновити рецензію' : 'Надіслати рецензію'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ReviewForm;