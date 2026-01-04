
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
    className: 'Class 8',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clean inputs to avoid whitespace errors
    const inputName = formData.name.trim().toLowerCase();
    const inputPhone = formData.phone.trim();
    const inputClass = formData.className.trim();

    try {
      // 1. Admin Login Bypass (Hardcoded for convenience)
      if (inputPhone === '9999999999') {
        onLogin({ id: 'admin', name: 'Admin', phone: '9999999999', role: 'admin', status: 'approved' });
        navigate('/dashboard/admin');
        return;
      }

      // 2. Fetch all records matching the phone number
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('phone', inputPhone);

      if (error) {
        alert(`Connection Error: ${error.message}`);
        setLoading(false);
        return;
      }

      // 3. Check if phone exists at all (Helps diagnose RLS vs typos)
      if (!data || data.length === 0) {
        // Double check: can we even see the table?
        const { count } = await supabase.from('students').select('*', { count: 'exact', head: true });
        if (count === 0 || count === null) {
          alert("SECURITY BLOCK: The database is hiding all records. \n\nFIX: Go to Supabase SQL Editor and run:\nALTER TABLE students DISABLE ROW LEVEL SECURITY;");
        } else {
          alert(`Phone number "${inputPhone}" is not registered. Please sign up first.`);
        }
        setLoading(false);
        return;
      }

      // 4. Detailed Matching (Find the specific student in the phone group)
      const student = data.find(s => {
        const dbName = (s.name || '').toString().trim().toLowerCase();
        const dbClass = (s.class || '').toString().trim();
        // Allow partial name match for better UX (e.g. "Avinaba" matches "Avinaba Ghosh")
        const nameMatch = dbName === inputName || dbName.includes(inputName);
        const classMatch = dbClass === inputClass;
        return nameMatch && classMatch;
      });

      if (!student) {
        const first = data[0];
        alert(`DETAILS MISMATCH!\n\nWe found your phone, but the details don't match.\n\nYou typed: "${formData.name}" in "${formData.className}"\nDatabase has: "${first.name}" in "${first.class}"\n\nPlease match the database exactly.`);
        setLoading(false);
        return;
      }

      // 5. Success - Map DB student to UserProfile
      const user: UserProfile = {
        id: student.id,
        name: student.name,
        phone: student.phone,
        role: 'student',
        status: student.status as any,
        className: student.class
      };

      onLogin(user);
      
      // Navigate based on approval status
      if (user.status === 'approved') {
        navigate('/dashboard/student');
      } else {
        navigate('/dashboard/student'); // StudentDashboard handles the "Pending" screen
      }

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Student Login</h2>
          <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">Netaji Subhash Tutorial Home</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-blue-600 mb-1.5 ml-1">Full Name (as registered)</label>
            <input 
              name="name" 
              type="text" 
              required 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold text-slate-700 placeholder:opacity-30" 
              placeholder="e.g. Avinaba Ghosh" 
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
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold text-slate-700 placeholder:opacity-30" 
              placeholder="10-digit mobile number" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-blue-600 mb-1.5 ml-1">Select Your Class</label>
            <div className="relative">
              <select 
                name="className" 
                value={formData.className} 
                onChange={handleChange} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option>Class 10</option>
                <option>Class 9</option>
                <option>Class 8</option>
                <option>Class 7</option>
                <option>Class 6</option>
                <option>Class 5</option>
              </select>
              <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? <><i className="fas fa-circle-notch fa-spin mr-3"></i>Verifying...</> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-xs font-bold mb-2">New to Tutorial Home?</p>
          <Link to="/signup" className="text-blue-600 font-black text-xs uppercase hover:underline tracking-wider">Register for an Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
