
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Courses from './pages/Courses.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import StudentDashboard from './pages/StudentDashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import { UserProfile } from './types.ts';

const App: React.FC = () => {
  // Mocking auth state for the demonstration environment. 
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
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
          
          <Route 
            path="/dashboard/student/*" 
            element={user?.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/dashboard/admin/*" 
            element={user?.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default App;
