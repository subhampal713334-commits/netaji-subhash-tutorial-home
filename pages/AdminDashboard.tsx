
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { UserProfile, LiveClass, Material } from '../types.ts';
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
  const [loading, setLoading] = useState(false);
  
  const [matTitle, setMatTitle] = useState('');
  const [matClass, setMatClass] = useState('Class 10');
  const [matUrl, setMatUrl] = useState('');

  const loadData = async () => {
    try {
      const { data: stdData } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (stdData) setStudents(stdData);
      
      const { data: matData } = await supabase.from('materials').select('*').order('created_at', { ascending: false });
      if (matData) setMaterials(matData);
    } catch (e) {
      console.error("Admin Load Error:", e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
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

  const deleteMaterial = async (id: string) => {
    if (!confirm("Delete this?")) return;
    await supabase.from('materials').delete().eq('id', id);
    loadData();
  };

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-slate-800">
        <span className="text-xl font-black text-blue-400">ADMIN PANEL</span>
      </div>
      <nav className="flex-grow">
        <Link to="/" className="flex items-center px-8 py-4 font-bold text-slate-300 hover:bg-slate-800">
          <i className="fas fa-globe mr-4"></i> Website
        </Link>
        <Link to="/dashboard/admin" className={`flex items-center px-8 py-4 font-bold transition ${location.pathname === '/dashboard/admin' ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}>
          <i className="fas fa-users mr-4"></i> Students
        </Link>
        <Link to="/dashboard/admin/live" className={`flex items-center px-8 py-4 font-bold transition ${location.pathname.includes('/live') ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}>
          <i className="fas fa-video mr-4"></i> Live Class
        </Link>
        <Link to="/dashboard/admin/materials" className={`flex items-center px-8 py-4 font-bold transition ${location.pathname.includes('/materials') ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}>
          <i className="fas fa-folder mr-4"></i> Materials
        </Link>
      </nav>
      <div className="p-8">
        <button onClick={onLogout} className="text-red-400 font-bold flex items-center"><i className="fas fa-sign-out-alt mr-2"></i> Logout</button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <main className="flex-grow p-4 md:p-10">
        <Routes>
          <Route index element={
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="text-2xl font-bold mb-8 uppercase tracking-tight">Student Management</h3>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Student</th>
                        <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Class</th>
                        <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Status</th>
                        <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                       {students.map(s => (
                          <tr key={s.id} className="border-b hover:bg-slate-50">
                             <td className="py-4">
                               <p className="font-bold">{s.name}</p>
                               <p className="text-xs text-slate-400">{s.phone}</p>
                             </td>
                             <td className="py-4 text-sm font-bold">{s.class}</td>
                             <td className="py-4">
                               <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${s.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                             </td>
                             <td className="py-4 text-right flex justify-end gap-2">
                                <button onClick={() => updateStudentStatus(s.id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Approve</button>
                                <button onClick={() => updateStudentStatus(s.id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Reject</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          } />

          <Route path="live" element={
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-xl mx-auto md:mx-0">
               <h3 className="text-2xl font-bold mb-8 uppercase tracking-tight">Host Live Session</h3>
               <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Grade</label>
                    <select value={targetClass} onChange={(e) => setTargetClass(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold">
                      <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Session Title</label>
                    <input value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold" placeholder="e.g. History Chapter 2" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Meet Link</label>
                    <input value={meetLink} onChange={(e) => setMeetLink(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold" placeholder="https://meet.google.com/..." />
                  </div>
                  <button onClick={startLiveClass} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                    {loading ? 'Starting...' : 'Launch Live Session'}
                  </button>
               </div>
            </div>
          } />

          <Route path="materials" element={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 h-fit">
                  <h3 className="text-2xl font-bold mb-8 uppercase tracking-tight">Upload Material</h3>
                  <form onSubmit={handleAddMaterial} className="space-y-4">
                     <input value={matTitle} onChange={(e) => setMatTitle(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold" placeholder="Title" />
                     <select value={matClass} onChange={(e) => setMatClass(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold">
                        <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                     </select>
                     <input value={matUrl} onChange={(e) => setMatUrl(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50 font-bold" placeholder="Resource Link (PDF or Drive)" />
                     <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-black transition">Upload</button>
                  </form>
               </div>
               <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-2xl font-bold mb-8 uppercase tracking-tight">Published Content</h3>
                  <div className="space-y-4">
                     {materials.map(m => (
                        <div key={m.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50">
                           <div className="truncate">
                              <p className="text-[10px] font-black uppercase text-blue-600">{m.class}</p>
                              <h4 className="font-bold text-slate-800 text-sm truncate">{m.title}</h4>
                           </div>
                           <button onClick={() => deleteMaterial(m.id)} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                        </div>
                     ))}
                     {materials.length === 0 && <p className="text-slate-400 italic text-center py-12">No files uploaded.</p>}
                  </div>
               </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
