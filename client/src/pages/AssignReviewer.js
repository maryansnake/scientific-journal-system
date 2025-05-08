import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import api from '../utils/api';

const AssignReviewer = () => {
  const { manuscriptId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  
  const [manuscript, setManuscript] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [assigningReviewer, setAssigningReviewer] = useState(false);

  // Перевірка прав доступу
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'editor') {
      addAlert('У вас немає дозволу на цю операцію', 'error');
      navigate('/dashboard');
    }
  }, [user, addAlert, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Отримання рукопису
        const manuscriptRes = await api.get(`/api/v1/manuscripts/${manuscriptId}`);
        setManuscript(manuscriptRes.data.data);
        
        // Отримання всіх рецензентів
        const usersRes = await api.get('/api/v1/users');
        const allReviewers = usersRes.data.data.filter(user => user.role === 'reviewer');
        setReviewers(allReviewers);
      } catch (err) {
        addAlert('Помилка завантаження даних', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [manuscriptId, addAlert, navigate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleAssignClick = (reviewer) => {
    setSelectedReviewer(reviewer);
    setAssignDialogOpen(true);
  };

  const handleAssignReviewer = async () => {
    if (!selectedReviewer) return;
    
    try {
      setAssigningReviewer(true);
      await api.post(`/api/v1/manuscripts/${manuscriptId}/assign-reviewer/${selectedReviewer._id}`);
      addAlert(`Рецензента ${selectedReviewer.name} успішно призначено`, 'success');
      navigate(`/manuscripts/${manuscriptId}`);
    } catch (err) {
      addAlert(err.response?.data?.message || 'Помилка призначення рецензента', 'error');
    } finally {
      setAssigningReviewer(false);
      setAssignDialogOpen(false);
    }
  };

  const filteredReviewers = reviewers.filter(reviewer => 
    reviewer.name.toLowerCase().includes(searchTerm) ||
    reviewer.email.toLowerCase().includes(searchTerm)
  );

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
          Призначення рецензента
        </Typography>
        <Typography variant="h6" gutterBottom>
          {manuscript.title}
        </Typography>
        <Typography variant="body1" paragraph>
          Автор: {manuscript.author.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Оберіть рецензента для цього рукопису:
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Пошук рецензентів"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
        />
        
        <List>
          {filteredReviewers.length > 0 ? (
            filteredReviewers.map((reviewer) => (
              <React.Fragment key={reviewer._id}>
                <ListItem 
                  secondaryAction={
                    <Button 
                      variant="outlined"
                      onClick={() => handleAssignClick(reviewer)}
                    >
                      Призначити
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={reviewer.name}
                    secondary={reviewer.email}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography sx={{ p: 2, textAlign: 'center' }}>
              Рецензентів не знайдено
            </Typography>
          )}
        </List>
      </Paper>
      
      {/* Діалог підтвердження призначення */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
      >
        <DialogTitle>Підтвердження призначення</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете призначити {selectedReviewer?.name} рецензентом для рукопису "{manuscript?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)} disabled={assigningReviewer}>
            Скасувати
          </Button>
          <Button 
            onClick={handleAssignReviewer} 
            color="primary" 
            disabled={assigningReviewer}
            autoFocus
          >
            {assigningReviewer ? <CircularProgress size={24} /> : 'Призначити'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssignReviewer;