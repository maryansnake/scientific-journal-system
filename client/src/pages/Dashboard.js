import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManuscripts = async () => {
      try {
        const res = await api.get('/api/v1/manuscripts');
        setManuscripts(res.data.data);
      } catch (err) {
        addAlert('Помилка завантаження рукописів', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchManuscripts();
  }, [addAlert]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'На розгляді': return 'warning';
      case 'Прийнято': return 'success';
      case 'Відхилено': return 'error';
      case 'Потребує доопрацювання': return 'info';
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Мій кабінет</Typography>
          <Button
            component={RouterLink}
            to="/manuscripts/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Новий рукопис
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="h6">Особиста інформація</Typography>
              <Typography>Ім'я: {user?.name}</Typography>
              <Typography>Email: {user?.email}</Typography>
              <Typography>
                Роль: {user?.role === 'admin' ? 'Адміністратор' : user?.role === 'author' ? 'Автор' : 'Рецензент'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Мої рукописи</Typography>
        
        {manuscripts.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Назва</TableCell>
                  <TableCell>Журнал</TableCell>
                  <TableCell>Дата подання</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {manuscripts.map((manuscript) => (
                  <TableRow key={manuscript._id}>
                    <TableCell>{manuscript.title}</TableCell>
                    <TableCell>{manuscript.journal ? manuscript.journal.name : 'Не призначено'}</TableCell>
                    <TableCell>
                      {new Date(manuscript.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={manuscript.status} 
                        color={getStatusColor(manuscript.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        component={RouterLink}
                        to={`/manuscripts/${manuscript._id}`}
                        size="small"
                        color="primary"
                      >
                        Деталі
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>У вас поки немає рукописів. Створіть новий рукопис для початку роботи.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;