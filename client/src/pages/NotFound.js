import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center'
        }}
      >
        <ErrorIcon sx={{ fontSize: 100, mb: 3, color: 'error.main' }} />
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Сторінку не знайдено
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Сторінка, яку ви шукаєте, не існує або була переміщена.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
        >
          Повернутися на головну
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;