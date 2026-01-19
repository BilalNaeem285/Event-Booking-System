import Dashboard from './pages/Dashboard';
import Login from './auth/Login';
import Register from './auth/Register';
import Wallet from '../src/pages/Wallet/Wallet';
import Notifications from '../src/pages/Notifications/Notifications';
import CreateEvent from '../src/pages/Events/CreateEvent';
import UpdateEvent from '../src/pages/Events/UpdateEvent';
import DeleteEvent from '../src/pages/Events/DeleteEvent';
import MyBookings from '../src/pages/Bookings/MyBookings';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />

          {/* User-only */}
          <Route
            path="/mybookings"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Creator-only */}
          <Route
            path="/wallet"
            element={
              <ProtectedRoute allowedRoles={['CREATOR']}>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute allowedRoles={['CREATOR']}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/delete-event"
            element={
              <ProtectedRoute allowedRoles={['CREATOR']}>
                <DeleteEvent />
              </ProtectedRoute>
            }
          />

          {/* Notifications for both roles */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/update-event/:eventId"
            element={
              <ProtectedRoute allowedRoles={['CREATOR']}>
                <UpdateEvent />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
