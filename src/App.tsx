import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider } from './contexts/DemoContext';
import { AuthProvider } from './contexts/AuthContext';
import { SeatProvider } from './contexts/SeatContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SeatPage } from './pages/SeatPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { GlobalCursor } from './components/GlobalCursor';

const AppRoutes: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/seat/:seatCode" element={<SeatPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <AuthProvider>
          <SeatProvider>
            <GlobalCursor />
            <AppRoutes />
          </SeatProvider>
        </AuthProvider>
      </DemoProvider>
    </BrowserRouter>
  );
}

export default App;
