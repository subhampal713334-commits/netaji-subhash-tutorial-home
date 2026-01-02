
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../types.ts';
import { useLanguage } from '../LanguageContext.tsx';
import { supabase } from '../supabase.ts';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    className: 'Class 10',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.phone === '9999999999') {
        const adminUser: UserProfile = {
          id: 'admin-id',
          name: 'NST Admin',
          phone: '9999999999',
          role: 'admin',
          status: 'approved'
        };
        onLogin(adminUser);
        navigate('/dashboard/admin');
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('phone', formData.phone)
        .eq('class', formData.className)
        .ilike('name', formData.name.trim())
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        alert("No matching record found. Please verify your Name, Phone, and Class.");
      } else {
        const user: UserProfile = {
          id: data.id,
          name: data.name,
          phone: data.phone,
          role: 'student',
          status: data.status as any,
          className: data.class
        };
        onLogin(user);
        navigate('/dashboard/student');
      }
    } catch (err: any) {
      console.error("Login Exception:", err);
      alert("Connection error: " + (err.message || "Please check your network."));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">register for a new account</Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name (as registered)</label>
              <div className="mt-1">
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. Rahul Das" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t.phone}</label>
              <div className="mt-1">
                <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="10 Digit Mobile No" />
              </div>
            </div>
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class</label>
              <div className="mt-1">
                <select id="className" name="className" value={formData.className} onChange={handleChange} className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
                  <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Verifying...</> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
