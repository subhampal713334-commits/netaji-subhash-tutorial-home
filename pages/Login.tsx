
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
    className: 'Class 8', // Defaulting to Class 8 as per your screenshot
  });
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDebugInfo(null);

    const inputName = formData.name.trim();
    const inputPhone = formData.phone.trim();
    const inputClass = formData.className.trim();

    try {
      // 1. Admin Login Bypass
      if (inputPhone === '9999999999') {
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

      // 2. Fetch students by Phone number only (Broad search)
      // This helps diagnose if RLS is blocking the query or if it's a field mismatch
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('phone', inputPhone);

      if (error) {
        throw new Error(`Database Error: ${error.message}`);
      }

      console.log("DB Results for phone:", data);

      if (!data || data.length === 0) {
        alert(`NO RECORD FOUND: We couldn't find ANY student with phone "${inputPhone}".\n\nSolution:\n1. Check if you typed the phone correctly.\n2. In Supabase, make sure "Row Level Security (RLS)" is DISABLED for the "students" table, or a policy is set to allow SELECT.`);
        setLoading(false);
        return;
      }

      // 3. Precise Matching in JavaScript (Case-insensitive & Trimmed)
      const matchedStudent = data.find(s => {
        const dbName = (s.name || '').toString().trim().toLowerCase();
        const dbClass = (s.class || s.className || '').toString().trim();
        
        const nameMatch = dbName === inputName.toLowerCase();
        const classMatch = dbClass === inputClass;
        
        return nameMatch && classMatch;
      });

      if (!matchedStudent) {
        // Record exists but details are different
        const first = data[0];
        const msg = `PHONE FOUND, BUT DETAILS MISMATCH.\n\n` +
                    `You Entered:\nName: "${inputName}"\nClass: "${inputClass}"\n\n` +
                    `Database Has:\nName: "${first.name}"\nClass: "${first.class}"\n\n` +
                    `Please copy the database version exactly.`;
        alert(msg);
        setDebugInfo(`Database has: Name="${first.name}", Class="${first.class}"`);
      } else {
        // SUCCESS
        const user: UserProfile = {
          id: matchedStudent.id,
          name: matchedStudent.name,
          phone: matchedStudent.phone,
          role: 'student',
          status: matchedStudent.status as any,
          className: matchedStudent.class
        };
        onLogin(user);
        navigate('/dashboard/student');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      alert(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl border border-slate-100 ring-1 ring-slate-200/50">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Login</h1>
            <p className="text-slate-500 font-bold text-xs mt-2 tracking-widest uppercase">Netaji Subhash Tutorial Home</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-blue-600 mb-2 ml-1">Full Name</label>
              <input 
                name="name" 
                type="text" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold text-slate-700" 
                placeholder="As registered" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-blue-600 mb-2 ml-1">Phone Number</label>
              <input 
                name="phone" 
                type="tel" 
                required 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold text-slate-700" 
                placeholder="10-digit number" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-blue-600 mb-2 ml-1">Class / Grade</label>
              <select 
                name="className" 
                value={formData.className} 
                onChange={handleChange} 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-bold text-slate-700 appearance-none"
              >
                <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest"
            >
              {loading ? <><i className="fas fa-spinner fa-spin mr-3"></i>Verifying...</> : 'Sign In'}
            </button>
          </form>

          {debugInfo && (
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
               <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Diagnostic Info:</p>
               <p className="text-xs font-bold text-amber-800">{debugInfo}</p>
            </div>
          )}

          <div className="mt-10 text-center border-t border-slate-50 pt-8">
            <p className="text-slate-400 text-sm font-bold">New Student?</p>
            <Link to="/signup" className="text-blue-600 font-black uppercase text-xs mt-2 block hover:underline">Register for Classes</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
