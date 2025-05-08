import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Головний банер */}
      <Paper
        sx={{
          p: 6,
          mb: 4,
          backgroundColor: (theme) => theme.palette.primary.main,
          color: 'white',
          position: 'relative',
          borderRadius: 2,
          boxShadow: 4
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom>
              Система підготовки наукових видань
            </Typography>
            <Typography variant="h6" component="p" sx={{ mb: 4 }}>
              Ефективне управління науковими публікаціями, рецензування та публікація наукових журналів
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
            >
              Почати роботу
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Інформаційні блоки */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <ArticleIcon color="primary" sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Для авторів
            </Typography>
            <Typography>
              Зручний процес подання рукописів, відстеження статусу та комунікація з редакторами.
              Спростіть весь шлях від подання до публікації.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <SchoolIcon color="primary" sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Для рецензентів
            </Typography>
            <Typography>
              Ефективне рецензування, зручні інструменти для оцінювання та коментування.
              Зробіть процес рецензування швидким і якісним.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <MenuBookIcon color="primary" sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Для редакторів
            </Typography>
            <Typography>
              Повний контроль над процесом публікації, призначення рецензентів та управління випусками журналу.
              Підвищіть ефективність редакційної роботи.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;