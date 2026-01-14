
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

    const inputName = formData.name.trim().toLowerCase();
    const inputPhone = formData.phone.trim();
    const inputClass = formData.className.trim();

    try {
      // Admin Bypass
      if (inputPhone === '9999999999') {
        onLogin({ id: 'admin', name: 'Admin', phone: '9999999999', role: 'admin', status: 'approved' });
        navigate('/dashboard/admin');
        return;
      }

      // 1. Fetch data
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('phone', inputPhone);

      if (error) {
        throw new Error(`Database Error: ${error.message}`);
      }

      // 2. Handle 'Record not found' specifically for RLS
      if (!data || data.length === 0) {
        alert(`Account not found for ${inputPhone}. \n\nNote: If you just enabled RLS in Supabase, ensure you added a 'SELECT' policy, otherwise the database will return empty even if the record exists.`);
        setLoading(false);
        return;
      }

      // 3. Match logic
      const student = data.find(s => {
        const dbName = (s.name || '').toString().trim().toLowerCase();
        const dbClass = (s.class || '').toString().trim();
        // Loose match for name to be user-friendly, exact match for class
        return (dbName === inputName || dbName.includes(inputName)) && dbClass === inputClass;
      });

      if (!student) {
        alert("Details Mismatch: The Name or Class does not match our records for this phone number.");
        setLoading(false);
        return;
      }

      const user: UserProfile = {
        id: student.id,
        name: student.name,
        phone: student.phone,
        role: 'student',
        status: student.status as any,
        className: student.class
      };

      onLogin(user);
      navigate('/dashboard/student');

    } catch (err: any) {
      alert("System Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Student Login</h2>
          <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">Netaji Subhash Tutorial Home</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-blue-600 mb-1.5 ml-1">Full Name</label>
            <input 
              name="name" 
              type="text" 
              required 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-300" 
              placeholder="Enter your name" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-blue-600 mb-1.5 ml-1">Phone Number</label>
            <input 
              name="phone" 
              type="tel" 
              required 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-300" 
              placeholder="e.g. 9832878993" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-blue-600 mb-1.5 ml-1">Your Class</label>
            <select 
              name="className" 
              value={formData.className} 
              onChange={handleChange} 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold text-slate-700 appearance-none cursor-pointer"
            >
              <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin mr-3"></i> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <Link to="/signup" className="text-blue-600 font-black text-xs uppercase hover:underline tracking-wider">Create New Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
