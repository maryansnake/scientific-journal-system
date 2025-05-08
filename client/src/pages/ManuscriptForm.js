import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { AlertContext } from '../context/AlertContext';
import api from '../utils/api';

const ManuscriptForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const [journals, setJournals] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    journal: '',
    coAuthors: ''
  });

  // Перевірка чи це редагування існуючого рукопису
  const isEditMode = Boolean(id);

  useEffect(() => {
    // Завантаження списку журналів
    const fetchJournals = async () => {
      try {
        const res = await api.get('/api/v1/journals');
        setJournals(res.data.data);
      } catch (err) {
        addAlert('Помилка завантаження списку журналів', 'error');
      }
    };

    // Завантаження даних рукопису для редагування
    const fetchManuscript = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/manuscripts/${id}`);
        const manuscript = res.data.data;
        
        setFormData({
          title: manuscript.title || '',
          abstract: manuscript.abstract || '',
          keywords: manuscript.keywords?.join(', ') || '',
          journal: manuscript.journal?._id || '',
          coAuthors: manuscript.coAuthors?.join(', ') || ''
        });
      } catch (err) {
        addAlert('Помилка завантаження даних рукопису', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
    fetchManuscript();
  }, [id, isEditMode, addAlert, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const manuscriptData = {
        ...formData,
        keywords: formData.keywords.split(',').map(keyword => keyword.trim()),
        coAuthors: formData.coAuthors ? formData.coAuthors.split(',').map(author => author.trim()) : []
      };
      
      if (isEditMode) {
        await api.put(`/api/v1/manuscripts/${id}`, manuscriptData);
        addAlert('Рукопис успішно оновлено', 'success');
      } else {
        await api.post('/api/v1/manuscripts', manuscriptData);
        addAlert('Рукопис успішно створено', 'success');
      }
      
      navigate('/dashboard');
    } catch (err) {
      addAlert(err.response?.data?.message || 'Помилка збереження рукопису', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {isEditMode ? 'Редагування рукопису' : 'Новий рукопис'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Назва рукопису"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Анотація"
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Ключові слова (через кому)"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            helperText="Введіть ключові слова через кому"
          />
          
          <TextField
            margin="normal"
            fullWidth
            label="Співавтори (через кому)"
            name="coAuthors"
            value={formData.coAuthors}
            onChange={handleChange}
            helperText="Введіть імена співавторів через кому (за наявності)"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Журнал</InputLabel>
            <Select
              name="journal"
              value={formData.journal}
              onChange={handleChange}
              label="Журнал"
              required
            >
              {journals.map(journal => (
                <MenuItem key={journal._id} value={journal._id}>
                  {journal.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Оберіть журнал для публікації</FormHelperText>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            >
              Скасувати
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEditMode ? (
                'Оновити рукопис'
              ) : (
                'Створити рукопис'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ManuscriptForm;