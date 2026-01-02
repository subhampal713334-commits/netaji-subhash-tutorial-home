
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { UserProfile, UserRole } from './types';

const App: React.FC = () => {
  // Mocking auth state for the demonstration environment. 
  // In a real app, this would use Supabase Auth hooks.
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate initial auth check
    const storedUser = localStorage.getItem('nst_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nst_user');
    setUser(null);
  };

  const loginUser = (userData: UserProfile) => {
    localStorage.setItem('nst_user', JSON.stringify(userData));
    setUser(userData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Dashboard paths should not show global header/footer
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Header user={user} onLogout={handleLogout} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onLogin={loginUser} />} />
          <Route path="/signup" element={<Signup onSignup={loginUser} />} />
          
          {/* Protected Student Routes */}
          <Route 
            path="/dashboard/student/*" 
            element={user?.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/dashboard/admin/*" 
            element={user?.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />

          {/* Catch all redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default App;
