import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AlertContext } from '../context/AlertContext';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addAlert } = useContext(AlertContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await api.get('/api/v1/journals');
        setJournals(res.data.data);
      } catch (err) {
        addAlert('Помилка завантаження журналів', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, [addAlert]);

  const filteredJournals = journals.filter(journal =>
    journal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Наукові журнали
        </Typography>
        
        {user?.role === 'admin' && (
          <Button
            component={RouterLink}
            to="/journals/new"
            variant="contained"
          >
            Додати журнал
          </Button>
        )}
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Пошук журналів"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Box>
      
      {filteredJournals.length > 0 ? (
        <Grid container spacing={3}>
          {filteredJournals.map(journal => (
            <Grid item key={journal._id} xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {journal.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ISSN: {journal.issn}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {journal.description.length > 150
                      ? `${journal.description.substring(0, 150)}...`
                      : journal.description}
                  </Typography>
                  
                  <Box>
                    <Chip 
                      label={journal.subject} 
                      size="small" 
                      sx={{ mr: 1 }} 
                    />
                    <Chip 
                      label={`Випусків: ${journal.issuesCount || 0}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to={`/journals/${journal._id}`}
                  >
                    Детальніше
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">Журналів не знайдено</Typography>
          <Typography variant="body2">
            Спробуйте змінити пошуковий запит або перегляньте всі доступні журнали
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default JournalList;