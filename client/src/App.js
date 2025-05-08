import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Компоненти
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';

// Сторінки
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManuscriptForm from './pages/ManuscriptForm';
import ManuscriptDetail from './pages/ManuscriptDetail';
import JournalList from './pages/JournalList';
import JournalDetail from './pages/JournalDetail';
import NotFound from './pages/NotFound';
import ReviewNew from './pages/ReviewNew';
import ReviewEdit from './pages/ReviewEdit';
import ReviewDetail from './pages/ReviewDetail';
import AssignReviewer from './pages/AssignReviewer';

// Контекст
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import PrivateRoute from './components/routing/PrivateRoute';

// Створення теми
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <AuthProvider>
      <AlertProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Header />
            <Alert />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={<PrivateRoute component={Dashboard} />} 
              />
              
              {/* Маршрути для рукописів */}
              <Route 
                path="/manuscripts/new" 
                element={<PrivateRoute component={ManuscriptForm} />} 
              />
              <Route 
                path="/manuscripts/:id" 
                element={<PrivateRoute component={ManuscriptDetail} />} 
              />
              <Route 
                path="/manuscripts/edit/:id" 
                element={<PrivateRoute component={ManuscriptForm} />} 
              />
              
              {/* Маршрути для рецензій */}
              <Route 
                path="/manuscripts/:manuscriptId/review/new" 
                element={<PrivateRoute component={ReviewNew} />} 
              />
              <Route 
                path="/manuscripts/:manuscriptId/assign-reviewer" 
                element={<PrivateRoute component={AssignReviewer} />} 
              />
              <Route 
                path="/reviews/:reviewId" 
                element={<PrivateRoute component={ReviewDetail} />} 
              />
              <Route 
                path="/reviews/edit/:reviewId" 
                element={<PrivateRoute component={ReviewEdit} />} 
              />
              
              {/* Маршрути для журналів */}
              <Route path="/journals" element={<JournalList />} />
              <Route path="/journals/:id" element={<JournalDetail />} />
              
              {/* Сторінка 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </Router>
        </ThemeProvider>
      </AlertProvider>
    </AuthProvider>
  );
};

export default App;