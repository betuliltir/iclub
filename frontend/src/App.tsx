import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme';
import Login from './components/Login';
import Register from './components/Register';
import EventCalendar from './components/EventCalendar';
import ClubManagerCalendar from './components/ClubManagerCalendar';
import AdminCalendar from './components/AdminCalendar';
import HomePage from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';

const AppContent = () => {
  const { user } = useAuth();

  // Helper function to determine the default calendar route based on user role
  const getDefaultCalendarRoute = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/calendar';
      case 'clubManager':
        return '/manager/calendar';
      default:
        return '/calendar';
    }
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Navigate to={getDefaultCalendarRoute()} replace />
          </PrivateRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <PrivateRoute>
            <EventCalendar />
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/calendar"
        element={
          <PrivateRoute>
            {user?.role === 'clubManager' ? (
              <ClubManagerCalendar />
            ) : (
              <Navigate to="/calendar" replace />
            )}
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/calendar"
        element={
          <PrivateRoute>
            {user?.role === 'admin' ? (
              <AdminCalendar />
            ) : (
              <Navigate to="/calendar" replace />
            )}
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
