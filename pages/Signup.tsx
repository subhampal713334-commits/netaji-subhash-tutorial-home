
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { useLanguage } from '../LanguageContext';
import { supabase } from '../supabase';

interface SignupProps {
  onSignup: (user: UserProfile) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
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
      // Check if phone exists
      const { data: existing } = await supabase
        .from('students')
        .select('phone')
        .eq('phone', formData.phone)
        .maybeSingle();

      if (existing) {
        alert("This phone number is already registered. Please login.");
        navigate('/login');
        return;
      }

      // Insert new student
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name: formData.name,
          phone: formData.phone,
          class: formData.className,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      const userData: UserProfile = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        role: 'student',
        status: data.status,
        className: data.class
      };

      onSignup(userData);
      navigate('/dashboard/student');
    } catch (err) {
      alert("Error during registration: " + (err as Error).message);
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Join NST Home</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Login here</Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t.phone}</label>
              <div className="mt-1">
                <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="9832878993" />
              </div>
            </div>
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700">Select Class</label>
              <div className="mt-1">
                <select id="className" name="className" value={formData.className} onChange={handleChange} className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
                  <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" disabled={loading} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Requesting Access...</> : 'Request Access'}
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-4 italic">* Note: Your account will require admin approval after registration.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
