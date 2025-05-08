import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ReviewIcon from '@mui/icons-material/RateReview';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import api from '../utils/api';
import ReviewCard from '../components/reviews/ReviewCard';

const ManuscriptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  
  const [manuscript, setManuscript] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchManuscript = async () => {
      try {
        const res = await api.get(`/api/v1/manuscripts/${id}`);
        setManuscript(res.data.data);
      } catch (err) {
        addAlert('Помилка завантаження інформації про рукопис', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await api.get(`/api/v1/manuscripts/${id}/reviews`);
        setReviews(res.data.data);
      } catch (err) {
        console.error('Помилка завантаження рецензій', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchManuscript();
    fetchReviews();
  }, [id, addAlert, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/v1/manuscripts/${id}`);
      addAlert('Рукопис успішно видалено', 'success');
      navigate('/dashboard');
    } catch (err) {
      addAlert('Помилка видалення рукопису', 'error');
    }
    setDeleteDialogOpen(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      addAlert('Будь ласка, виберіть PDF файл', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('manuscript', selectedFile);

    try {
      setUploading(true);
      await api.post(`/api/v1/manuscripts/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      addAlert('Файл успішно завантажено', 'success');
      
      // Оновити інформацію про рукопис
      const res = await api.get(`/api/v1/manuscripts/${id}`);
      setManuscript(res.data.data);
      setSelectedFile(null);
    } catch (err) {
      addAlert('Помилка завантаження файлу', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadFile = async () => {
    try {
      window.open(`/api/v1/manuscripts/${id}/file`, '_blank');
    } catch (err) {
      addAlert('Помилка завантаження файлу', 'error');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/api/v1/reviews/${reviewId}`);
      addAlert('Рецензію успішно видалено', 'success');
      
      // Оновити список рецензій
      const res = await api.get(`/api/v1/manuscripts/${id}/reviews`);
      setReviews(res.data.data);
    } catch (err) {
      addAlert('Помилка видалення рецензії', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'На розгляді': return 'warning';
      case 'Прийнято': return 'success';
      case 'Відхилено': return 'error';
      case 'Потребує доопрацювання': return 'info';
      case 'На рецензуванні': return 'primary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isAuthor = manuscript.author._id === user?.id;
  const isAdminOrEditor = user?.role === 'admin' || user?.role === 'editor';
  const isReviewer = user?.role === 'reviewer';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h1">
            {manuscript.title}
          </Typography>
          
          <Chip 
            label={manuscript.status} 
            color={getStatusColor(manuscript.status)} 
          />
        </Box>
        
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Основна інформація" />
          <Tab label="Рецензії" />
          {isAdminOrEditor && <Tab label="Управління" />}
        </Tabs>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Основна інформація */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Анотація
              </Typography>
              <Typography paragraph>{manuscript.abstract}</Typography>
              
              <Typography variant="h6" gutterBottom>
                Ключові слова
              </Typography>
              <Box sx={{ mb: 2 }}>
                {manuscript.keywords?.map((keyword, index) => (
                  <Chip 
                    key={index} 
                    label={keyword} 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>
              
              {manuscript.coAuthors && manuscript.coAuthors.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Співавтори
                  </Typography>
                  <List dense>
                    {manuscript.coAuthors.map((author, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={author} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Файл рукопису
                </Typography>
                
                {manuscript.file ? (
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleDownloadFile}
                  >
                    Завантажити PDF
                  </Button>
                ) : (
                  <Typography paragraph>Файл ще не завантажено</Typography>
                )}
                
                {(isAuthor || isAdminOrEditor) && (
                  <Box sx={{ mt: 2 }}>
                    <input
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      id="upload-manuscript-button"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="upload-manuscript-button">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<FileUploadIcon />}
                      >
                        Вибрати PDF файл
                      </Button>
                    </label>
                    
                    {selectedFile && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Обрано файл: {selectedFile.name}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFileUpload}
                          disabled={uploading}
                          sx={{ mt: 1 }}
                        >
                          {uploading ? <CircularProgress size={24} /> : 'Завантажити'}
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>
                  Інформація
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Автор:</strong> {manuscript.author.name}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Журнал:</strong> {manuscript.journal?.name || 'Не визначено'}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Дата подання:</strong> {new Date(manuscript.submittedAt).toLocaleDateString()}
                </Typography>
                
                {manuscript.updatedAt && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Останнє оновлення:</strong> {new Date(manuscript.updatedAt).toLocaleDateString()}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {/* Рецензії */}
        {tabValue === 1 && (
          <Box>
            {reviewsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : reviews.length > 0 ? (
              <Box>
                {reviews.map(review => (
                  <ReviewCard 
                    key={review._id} 
                    review={review} 
                    onDelete={handleDeleteReview}
                    showActions={review.reviewer._id === user?.id || isAdminOrEditor}
                  />
                ))}
              </Box>
            ) : (
              <Typography paragraph>
                Рецензії відсутні для цього рукопису.
              </Typography>
            )}
            
            {isReviewer && (
              <Button
                variant="contained"
                startIcon={<ReviewIcon />}
                component={RouterLink}
                to={`/manuscripts/${id}/review/new`}
                sx={{ mt: 2 }}
              >
                Додати рецензію
              </Button>
            )}
            
            {(isAdminOrEditor) && (
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                component={RouterLink}
                to={`/manuscripts/${id}/assign-reviewer`}
                sx={{ mt: 2, ml: isReviewer ? 2 : 0 }}
              >
                Призначити рецензента
              </Button>
            )}
          </Box>
        )}
        
        {/* Управління для адміністраторів та редакторів */}
        {tabValue === 2 && isAdminOrEditor && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Управління рукописом
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Зміна статусу рукопису
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="success"
                      sx={{ mr: 2, mb: 2 }}
                      onClick={async () => {
                        try {
                          await api.put(`/api/v1/manuscripts/${id}`, { status: 'Прийнято' });
                          addAlert('Статус рукопису оновлено', 'success');
                          setManuscript(prev => ({ ...prev, status: 'Прийнято' }));
                        } catch (err) {
                          addAlert('Помилка оновлення статусу', 'error');
                        }
                      }}
                    >
                      Прийняти
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color="warning"
                      sx={{ mr: 2, mb: 2 }}
                      onClick={async () => {
                        try {
                          await api.put(`/api/v1/manuscripts/${id}`, { status: 'Потребує доопрацювання' });
                          addAlert('Статус рукопису оновлено', 'success');
                          setManuscript(prev => ({ ...prev, status: 'Потребує доопрацювання' }));
                        } catch (err) {
                          addAlert('Помилка оновлення статусу', 'error');
                        }
                      }}
                    >
                      Потребує доопрацювання
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color="error"
                      sx={{ mb: 2 }}
                      onClick={async () => {
                        try {
                          await api.put(`/api/v1/manuscripts/${id}`, { status: 'Відхилено' });
                          addAlert('Статус рукопису оновлено', 'success');
                          setManuscript(prev => ({ ...prev, status: 'Відхилено' }));
                        } catch (err) {
                          addAlert('Помилка оновлення статусу', 'error');
                        }
                      }}
                    >
                      Відхилити
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Додаткові дії
                  </Typography>
                  
                  <Button
                    component={RouterLink}
                    to={`/manuscripts/edit/${id}`}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ mr: 2, mb: 2 }}
                    fullWidth
                  >
                    Редагувати рукопис
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{ mb: 2 }}
                    fullWidth
                  >
                    Видалити рукопис
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Назад до списку
          </Button>
          
          {(isAuthor || isAdminOrEditor) && tabValue !== 2 && (
            <Box>
              <Button
                component={RouterLink}
                to={`/manuscripts/edit/${id}`}
                variant="outlined"
                color="primary"
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
        </Box>
      </Paper>
      
      {/* Діалог підтвердження видалення */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити цей рукопис? Ця дія не може бути скасована.
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

export default ManuscriptDetail;