
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { UserProfile, LiveClass, Material, Schedule } from '../types.ts';
import { supabase } from '../supabase.ts';

interface AdminDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [targetClass, setTargetClass] = useState('Class 10');
  const [students, setStudents] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [matTitle, setMatTitle] = useState('');
  const [matClass, setMatClass] = useState('Class 10');
  const [matUrl, setMatUrl] = useState('');

  const [schDay, setSchDay] = useState('Monday');
  const [schSubject, setSchSubject] = useState('');
  const [schTime, setSchTime] = useState('');
  const [schClass, setSchClass] = useState('Class 10');

  const loadData = async () => {
    try {
      const { data: stdData } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (stdData) setStudents(stdData);
      
      const { data: matData } = await supabase.from('materials').select('*').order('created_at', { ascending: false });
      if (matData) setMaterials(matData);

      const { data: schData } = await supabase.from('schedules').select('*').order('created_at', { ascending: false });
      if (schData) setSchedules(schData as Schedule[]);
    } catch (e) {
      console.error("Admin Load Error:", e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateStudentStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('students').update({ status }).eq('id', id);
    if (error) alert("Update failed: " + error.message);
    loadData();
  };

  const startLiveClass = async () => {
    if (!liveTitle || !meetLink) return alert("Fill all fields");
    setLoading(true);
    const now = new Date();
    const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    const { error } = await supabase.from('classes').insert([{
      class: targetClass,
      title: liveTitle,
      meet_link: meetLink,
      start_time: now.toISOString(),
      end_time: end.toISOString()
    }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Class broadcasted!");
      setLiveTitle('');
      setMeetLink('');
    }
    setLoading(false);
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle || !matUrl) return alert("Please fill all fields");
    setLoading(true);
    
    const { error } = await supabase.from('materials').insert([{
      class: matClass,
      title: matTitle,
      type: matUrl.includes('drive.google.com') ? 'drive' : 'pdf',
      resource_url: matUrl
    }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Material posted!");
      setMatTitle('');
      setMatUrl('');
      loadData();
    }
    setLoading(false);
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schSubject || !schTime) return alert("Please fill all fields");
    setLoading(true);

    const { error } = await supabase.from('schedules').insert([{
      class: schClass,
      subject: schSubject,
      day: schDay,
      time_slot: schTime
    }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Schedule updated!");
      setSchSubject('');
      setSchTime('');
      loadData();
    }
    setLoading(false);
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm("Delete this material?")) return;
    await supabase.from('materials').delete().eq('id', id);
    loadData();
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm("Delete this schedule slot?")) return;
    await supabase.from('schedules').delete().eq('id', id);
    loadData();
  };

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-slate-800 flex justify-between items-center">
        <span className="text-xl font-black text-blue-400">ADMIN PANEL</span>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>
      <nav className="flex-grow py-4">
        <Link to="/" className="flex items-center px-8 py-4 font-bold text-slate-300 hover:bg-slate-800 transition">
          <i className="fas fa-globe mr-4 w-5"></i> Website
        </Link>
        <Link 
          to="/dashboard/admin" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center px-8 py-4 font-bold transition ${location.pathname === '/dashboard/admin' ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          <i className="fas fa-users mr-4 w-5"></i> Students
        </Link>
        <Link 
          to="/dashboard/admin/schedule" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center px-8 py-4 font-bold transition ${location.pathname.includes('/schedule') ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          <i className="fas fa-calendar-alt mr-4 w-5"></i> Schedule
        </Link>
        <Link 
          to="/dashboard/admin/live" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center px-8 py-4 font-bold transition ${location.pathname.includes('/live') ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          <i className="fas fa-video mr-4 w-5"></i> Live Class
        </Link>
        <Link 
          to="/dashboard/admin/materials" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center px-8 py-4 font-bold transition ${location.pathname.includes('/materials') ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          <i className="fas fa-folder mr-4 w-5"></i> Materials
        </Link>
      </nav>
      <div className="p-8 border-t border-slate-800">
        <button onClick={onLogout} className="text-red-400 font-bold flex items-center hover:text-red-300 transition w-full">
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-[60] shadow-md">
        <span className="text-lg font-black text-blue-400">ADMIN PANEL</span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
          <i className="fas fa-bars text-2xl"></i>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-[70] md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 bg-slate-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <main className="flex-grow p-4 md:p-10 pb-20 md:pb-10">
        <Routes>
          <Route index element={
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
               <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase tracking-tight text-slate-800">Student Management</h3>
               <div className="overflow-x-auto -mx-5 md:mx-0">
                  <table className="w-full text-left min-w-[600px] md:min-w-0">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="px-5 py-4 font-bold text-slate-400 text-xs uppercase">Student</th>
                        <th className="px-5 py-4 font-bold text-slate-400 text-xs uppercase">Class</th>
                        <th className="px-5 py-4 font-bold text-slate-400 text-xs uppercase">Status</th>
                        <th className="px-5 py-4 font-bold text-slate-400 text-xs uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                       {students.map(s => (
                          <tr key={s.id} className="border-b hover:bg-slate-50 transition">
                             <td className="px-5 py-4">
                               <p className="font-bold text-slate-800">{s.name}</p>
                               <p className="text-xs text-slate-400">{s.phone}</p>
                             </td>
                             <td className="px-5 py-4 text-sm font-bold text-slate-600">{s.class}</td>
                             <td className="px-5 py-4">
                               <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${s.status === 'approved' ? 'bg-green-100 text-green-700' : s.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                 {s.status}
                               </span>
                             </td>
                             <td className="px-5 py-4 text-right flex justify-end gap-2">
                                <button 
                                  onClick={() => updateStudentStatus(s.id, 'approved')} 
                                  className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-700 transition shadow-sm"
                                  title="Approve"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => updateStudentStatus(s.id, 'rejected')} 
                                  className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-600 transition shadow-sm"
                                  title="Reject"
                                >
                                  Reject
                                </button>
                             </td>
                          </tr>
                       ))}
                       {students.length === 0 && (
                         <tr>
                           <td colSpan={4} className="py-10 text-center text-slate-400 font-bold">No students registered yet.</td>
                         </tr>
                       )}
                    </tbody>
                  </table>
               </div>
            </div>
          } />

          <Route path="schedule" element={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
               <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 h-fit">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase tracking-tight text-slate-800">Manage Schedule</h3>
                  <form onSubmit={handleAddSchedule} className="space-y-4">
                     <div>
                        <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Grade</label>
                        <select value={schClass} onChange={(e) => setSchClass(e.target.value)} className="w-full p-3.5 md:p-4 border rounded-xl bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition">
                           <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                        </select>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Day</label>
                           <select value={schDay} onChange={(e) => setSchDay(e.target.value)} className="w-full p-3.5 md:p-4 border rounded-xl bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition">
                              <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Subject</label>
                           <input value={schSubject} onChange={(e) => setSchSubject(e.target.value)} className="w-full p-3.5 md:p-4 border rounded-xl bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. History" />
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Time Slot</label>
                        <input value={schTime} onChange={(e) => setSchTime(e.target.value)} className="w-full p-3.5 md:p-4 border rounded-xl bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. 05:00 PM - 06:30 PM" />
                     </div>
                     <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg active:transform active:scale-95">
                       {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'Add Entry'}
                     </button>
                  </form>
               </div>
               <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase tracking-tight text-slate-800">Existing Routines</h3>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                     {schedules.map(s => (
                        <div key={s.id} className="p-4 border rounded-xl flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition border-slate-100">
                           <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase text-blue-600">{s.class} • {s.day}</p>
                              <h4 className="font-bold text-slate-800 text-sm truncate">{s.subject}</h4>
                              <p className="text-xs text-slate-500 font-mono">{s.time_slot}</p>
                           </div>
                           <button onClick={() => deleteSchedule(s.id)} className="text-red-400 p-2.5 hover:bg-red-50 rounded-full transition ml-2 shrink-0">
                             <i className="fas fa-trash"></i>
                           </button>
                        </div>
                     ))}
                     {schedules.length === 0 && <p className="text-slate-400 italic text-center py-12">No routines set yet.</p>}
                  </div>
               </div>
            </div>
          } />

          <Route path="live" element={
            <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 max-w-xl">
               <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase tracking-tight text-slate-800">Host Live Session</h3>
               <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Grade</label>
                    <select value={targetClass} onChange={(e) => setTargetClass(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition">
                      <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Session Title</label>
                    <input value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="e.g. History Chapter 2" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Meet Link</label>
                    <input value={meetLink} onChange={(e) => setMeetLink(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="https://meet.google.com/..." />
                  </div>
                  <button onClick={startLiveClass} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg active:transform active:scale-95">
                    {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Broadcasting...</> : 'Launch Live Session'}
                  </button>
               </div>
            </div>
          } />

          <Route path="materials" element={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
               <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 h-fit">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase tracking-tight text-slate-800">Upload Material</h3>
                  <form onSubmit={handleAddMaterial} className="space-y-4">
                     <div>
                        <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Resource Title</label>
                        <input value={matTitle} onChange={(e) => setMatTitle(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="e.g. Life Science Notes" />
                     </div>
                     <div>
                        <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Grade</label>
                        <select value={matClass} onChange={(e) => setMatClass(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition">
                           <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Resource Link</label>
                        <input value={matUrl} onChange={(e) => setMatUrl(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Google Drive or PDF URL" />
                     </div>
                     <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-black transition shadow-lg active:transform active:scale-95">
                       {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'Publish Resource'}
                     </button>
                  </form>
               </div>
               <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 uppercase tracking-tight text-slate-800">Published Content</h3>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                     {materials.map(m => (
                        <div key={m.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition">
                           <div className="truncate pr-4">
                              <p className="text-[10px] font-black uppercase text-blue-600">{m.class}</p>
                              <h4 className="font-bold text-slate-800 text-sm truncate">{m.title}</h4>
                           </div>
                           <button onClick={() => deleteMaterial(m.id)} className="text-red-400 p-2.5 hover:bg-red-50 rounded-full transition shrink-0">
                             <i className="fas fa-trash"></i>
                           </button>
                        </div>
                     ))}
                     {materials.length === 0 && <p className="text-slate-400 italic text-center py-12">No files uploaded.</p>}
                  </div>
               </div>
            </div>
          } />
        </Routes>
      </main>

      {/* CSS for custom scrollbar in dashboard lists */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
