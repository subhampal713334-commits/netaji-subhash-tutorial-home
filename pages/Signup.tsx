
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../types.ts';
import { useLanguage } from '../LanguageContext.tsx';
import { supabase } from '../supabase.ts';

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

    const cleanName = formData.name.trim();
    const cleanPhone = formData.phone.trim();
    const cleanClass = formData.className.trim();

    try {
      // Check for existing
      const { data: existing } = await supabase
        .from('students')
        .select('phone')
        .eq('phone', cleanPhone)
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
          name: cleanName,
          phone: cleanPhone,
          class: cleanClass,
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
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
        <p className="mt-2 text-sm text-gray-600 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl rounded-[2.5rem] border border-gray-100 ring-1 ring-gray-200/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest">Your Full Name</label>
              <input 
                name="name" 
                type="text" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold" 
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest">{t.phone}</label>
              <input 
                name="phone" 
                type="tel" 
                required 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold" 
                placeholder="e.g. 9832878993" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest">Select Class</label>
              <select 
                name="className" 
                value={formData.className} 
                onChange={handleChange} 
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold bg-white"
              >
                <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-widest"
            >
              {loading ? <><i className="fas fa-spinner fa-spin mr-3"></i>Processing...</> : 'Request Access'}
            </button>
            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-wider mt-4">
              * Account requires admin approval before access
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
