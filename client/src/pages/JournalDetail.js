import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import api from '../utils/api';

const JournalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await api.get(`/api/v1/journals/${id}`);
        setJournal(res.data.data);
      } catch (err) {
        addAlert('Помилка завантаження інформації про журнал', 'error');
        navigate('/journals');
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [id, addAlert, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/v1/journals/${id}`);
      addAlert('Журнал успішно видалено', 'success');
      navigate('/journals');
    } catch (err) {
      addAlert('Помилка видалення журналу', 'error');
    }
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {journal.name}
          </Typography>
          
          {(isAdmin || isEditor) && (
            <Box>
              {isAdmin && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ ml: 2 }}
                >
                  Видалити
                </Button>
              )}
              
              <Button
                component={RouterLink}
                to={`/journals/edit/${id}`}
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ ml: 2 }}
              >
                Редагувати
              </Button>
            </Box>
          )}
        </Box>
        
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          ISSN: {journal.issn}
        </Typography>
        
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Про журнал" />
          <Tab label="Останні випуски" />
          <Tab label="Для авторів" />
        </Tabs>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Інформація про журнал */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Опис
              </Typography>
              <Typography paragraph>{journal.description}</Typography>
              
              <Typography variant="h6" gutterBottom>
                Галузь науки
              </Typography>
              <Typography paragraph>{journal.subject}</Typography>
              
              <Typography variant="h6" gutterBottom>
                Видавник
              </Typography>
              <Typography paragraph>{journal.publisher}</Typography>
              
              <Typography variant="h6" gutterBottom>
                Головний редактор
              </Typography>
              <Typography paragraph>{journal.chiefEditor || 'Інформація відсутня'}</Typography>
            </Grid>
          </Grid>
        )}
        
        {/* Випуски журналу */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Останні випуски
            </Typography>
            
            {journal.issues && journal.issues.length > 0 ? (
              <Grid container spacing={3}>
                {journal.issues.map((issue) => (
                  <Grid item key={issue._id} xs={12} md={6} lg={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          Том {issue.volume}, Випуск {issue.number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(issue.datePublished).toLocaleDateString()}
                        </Typography>
                        <Button size="small" sx={{ mt: 1 }}>
                          Переглянути
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>Випуски відсутні</Typography>
            )}
            
            {(isAdmin || isEditor) && (
              <Button
                variant="contained"
                sx={{ mt: 3 }}
              >
                Додати випуск
              </Button>
            )}
          </Box>
        )}
        
        {/* Інформація для авторів */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Вимоги до публікацій
            </Typography>
            <Typography paragraph>
              {journal.submissionGuidelines || 'Інформація про вимоги до публікацій відсутня'}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Періодичність виходу
            </Typography>
            <Typography paragraph>
              {journal.frequency || 'Інформація відсутня'}
            </Typography>
            
            <Button
              component={RouterLink}
              to="/manuscripts/new"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Подати рукопис
            </Button>
          </Box>
        )}
        
        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/journals')}
          >
            Назад до списку журналів
          </Button>
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
            Ви впевнені, що хочете видалити цей журнал? Ця дія не може бути скасована.
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

export default JournalDetail;