import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Link
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  
  const authLinks = (
    <>
      <Button component={RouterLink} to="/dashboard" color="inherit">
        Мій кабінет
      </Button>
      <Button component={RouterLink} to="/manuscripts/new" color="inherit">
        Новий рукопис
      </Button>
      <Button onClick={logout} color="inherit">
        Вихід
      </Button>
      {user && (
        <Typography variant="body1" sx={{ ml: 2 }}>
          {user.name}
        </Typography>
      )}
    </>
  );

  const guestLinks = (
    <>
      <Button component={RouterLink} to="/login" color="inherit">
        Вхід
      </Button>
      <Button component={RouterLink} to="/register" color="inherit">
        Реєстрація
      </Button>
    </>
  );

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link component={RouterLink} to="/" color="inherit" underline="none">
              Система наукових видань
            </Link>
          </Typography>
          <Box>
            <Button component={RouterLink} to="/journals" color="inherit">
              Журнали
            </Button>
            {isAuthenticated ? authLinks : guestLinks}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;