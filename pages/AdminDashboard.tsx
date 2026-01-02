
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { UserProfile, LiveClass, Material, Schedule } from '../types';
import { supabase } from '../supabase';

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
  
  // Schedule Form State
  const [schedClass, setSchedClass] = useState('Class 10');
  const [schedContent, setSchedContent] = useState('');

  // Material Form State
  const [matTitle, setMatTitle] = useState('');
  const [matClass, setMatClass] = useState('Class 10');
  const [matUrl, setMatUrl] = useState('');

  const loadData = async () => {
    try {
      const { data: stdData } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (stdData) setStudents(stdData);
      
      const { data: matData } = await supabase.from('materials').select('*').order('created_at', { ascending: false });
      if (matData) setMaterials(matData);

      const { data: schedData } = await supabase.from('schedules').select('*');
      if (schedData) setSchedules(schedData);
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
      alert("Class broadcasted successfully!");
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

  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedContent) return alert("Please enter schedule content");
    setLoading(true);

    const { error } = await supabase
      .from('schedules')
      .upsert({ 
        class: schedClass, 
        content: schedContent,
        updated_at: new Date().toISOString()
      }, { onConflict: 'class' });

    if (error) {
      alert("Error updating schedule: " + error.message);
    } else {
      alert("Schedule updated successfully!");
      setSchedContent('');
      loadData();
    }
    setLoading(false);
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm("Delete this?")) return;
    await supabase.from('materials').delete().eq('id', id);
    loadData();
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Delete student?")) return;
    await supabase.from('students').delete().eq('id', id);
    loadData();
  };

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-slate-800 flex justify-between items-center md:block">
        <span className="text-2xl font-black text-blue-400">ADMIN</span>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-white">
          <i className="fas fa-times text-2xl"></i>
        </button>
      </div>
      <nav className="flex-grow">
        <Link to="/" className="flex items-center px-8 py-5 font-black text-blue-300 hover:bg-slate-800 border-b border-slate-800 transition">
          <i className="fas fa-globe mr-4"></i> Public Website
        </Link>
        <Link to="/dashboard/admin" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-8 py-5 font-bold transition ${location.pathname === '/dashboard/admin' ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}>
          <i className="fas fa-users mr-4"></i> Students
        </Link>
        <Link to="/dashboard/admin/live" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-8 py-5 font-bold transition ${location.pathname.includes('/live') ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}>
          <i className="fas fa-broadcast-tower mr-4"></i> Live Session
        </Link>
        <Link to="/dashboard/admin/schedule" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-8 py-5 font-bold transition ${location.pathname.includes('/schedule') ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}>
          <i className="fas fa-calendar-alt mr-4"></i> Schedules
        </Link>
        <Link to="/dashboard/admin/materials" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-8 py-5 font-bold transition ${location.pathname.includes('/materials') ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}>
          <i className="fas fa-file-pdf mr-4"></i> Repository
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
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
        <span className="text-xl font-black text-blue-400">ADMIN PANEL</span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
          <i className="fas fa-bars text-2xl"></i>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 bg-slate-900 h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shadow-xl h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <main className="flex-grow p-4 md:p-10 overflow-y-auto w-full">
        <Routes>
          <Route index element={
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-4">
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase">Registered Students</h3>
                  <div className="bg-slate-100 px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold text-slate-500">{students.length} TOTAL</div>
               </div>
               <div className="overflow-x-auto -mx-5 md:mx-0">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="border-b">
                        <th className="px-5 pb-6 text-[10px] md:text-xs font-black uppercase text-slate-400">Identity</th>
                        <th className="px-5 pb-6 text-[10px] md:text-xs font-black uppercase text-slate-400">Contact</th>
                        <th className="px-5 pb-6 text-[10px] md:text-xs font-black uppercase text-slate-400">Status</th>
                        <th className="px-5 pb-6 text-[10px] md:text-xs font-black uppercase text-slate-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                       {students.map(s => (
                          <tr key={s.id} className="border-b hover:bg-slate-50 transition">
                             <td className="p-5">
                               <p className="font-bold text-slate-900 text-sm md:text-base">{s.name}</p>
                               <p className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest">{s.class}</p>
                             </td>
                             <td className="p-5 font-mono text-xs md:text-sm text-slate-500">{s.phone}</td>
                             <td className="p-5">
                               <span className={`px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase ${s.status === 'approved' ? 'bg-green-100 text-green-700' : s.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                 {s.status}
                               </span>
                             </td>
                             <td className="p-5 text-right">
                                <div className="flex justify-end space-x-2">
                                   <button onClick={() => updateStudentStatus(s.id, 'approved')} className="bg-green-600 text-white w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center hover:bg-green-700 shadow-sm transition" title="Approve"><i className="fas fa-check text-xs md:text-sm"></i></button>
                                   <button onClick={() => updateStudentStatus(s.id, 'rejected')} className="bg-orange-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center hover:bg-orange-600 shadow-sm transition" title="Reject"><i className="fas fa-times text-xs md:text-sm"></i></button>
                                   <button onClick={() => deleteStudent(s.id)} className="bg-red-100 text-red-600 w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white shadow-sm transition" title="Delete"><i className="fas fa-trash text-xs md:text-sm"></i></button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          } />

          <Route path="live" element={
            <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 max-w-2xl mx-auto md:mx-0">
               <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 uppercase">Initialize Broadcast</h3>
               <div className="space-y-5 md:space-y-6">
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 block">Target Grade</label>
                    <select value={targetClass} onChange={(e) => setTargetClass(e.target.value)} className="w-full px-4 py-3 md:px-5 md:py-4 border rounded-xl md:rounded-2xl bg-slate-50 font-bold focus:ring-2 focus:ring-red-500 outline-none">
                      <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 block">Session Title</label>
                    <input value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} className="w-full px-4 py-3 md:px-5 md:py-4 border rounded-xl md:rounded-2xl bg-slate-50 font-bold focus:ring-2 focus:ring-red-500 outline-none" placeholder="e.g. Life Science Chapter 4" />
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 block">Meet Link</label>
                    <input value={meetLink} onChange={(e) => setMeetLink(e.target.value)} className="w-full px-4 py-3 md:px-5 md:py-4 border rounded-xl md:rounded-2xl bg-slate-50 font-bold focus:ring-2 focus:ring-red-500 outline-none" placeholder="https://meet.google.com/..." />
                  </div>
                  <button onClick={startLiveClass} disabled={loading} className="w-full bg-red-600 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-xl hover:bg-red-700 transition active:scale-95 disabled:bg-slate-300 uppercase tracking-widest">
                    {loading ? 'Processing...' : 'Go Live Now'}
                  </button>
               </div>
            </div>
          } />

          <Route path="schedule" element={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
               <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 h-fit">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 md:mb-8 uppercase">Update Schedule</h3>
                  <form onSubmit={handleUpdateSchedule} className="space-y-4 md:space-y-6">
                     <div>
                       <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 block">Select Class</label>
                       <select value={schedClass} onChange={(e) => setSchedClass(e.target.value)} className="w-full px-4 py-3 md:px-5 md:py-4 border rounded-xl md:rounded-2xl bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none">
                         <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                       </select>
                     </div>
                     <div>
                       <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 block">Weekly Details (Text or List)</label>
                       <textarea 
                         value={schedContent} 
                         onChange={(e) => setSchedContent(e.target.value)} 
                         rows={6}
                         className="w-full px-4 py-3 md:px-5 md:py-4 border rounded-xl md:rounded-2xl bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                         placeholder="Mon: 7am - 9am&#10;Wed: 5pm - 7pm&#10;Fri: Mock Test"
                       ></textarea>
                     </div>
                     <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl hover:bg-black transition uppercase tracking-widest">
                        {loading ? 'Updating...' : 'Save Schedule'}
                     </button>
                  </form>
               </div>
               <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 md:mb-8 uppercase">Existing Schedules</h3>
                  <div className="space-y-3 md:space-y-4">
                     {schedules.map(s => (
                        <div key={s.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50">
                           <div className="flex justify-between items-center mb-2">
                             <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">{s.class}</span>
                             <span className="text-[9px] text-slate-400 font-bold uppercase">Updated: {new Date(s.updated_at).toLocaleDateString()}</span>
                           </div>
                           <pre className="text-sm font-bold text-slate-700 whitespace-pre-wrap font-sans">{s.content}</pre>
                        </div>
                     ))}
                     {schedules.length === 0 && <p className="text-slate-300 italic text-center py-10 text-sm">No schedules defined yet.</p>}
                  </div>
               </div>
            </div>
          } />

          <Route path="materials" element={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
               <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 h-fit">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 md:mb-8 uppercase">Upload Resource</h3>
                  <form onSubmit={handleAddMaterial} className="space-y-4 md:space-y-6">
                     <input value={matTitle} onChange={(e) => setMatTitle(e.target.value)} className="w-full px-4 py-3 md:px-5 md:py-4 border rounded-xl md:rounded-2xl bg-slate-50 font-bold" placeholder="File Title (e.g. Math Notes)" />
                     <select value={matClass} onChange={(e) => setMatClass(e.target.value)} className="w-full px-4 py-3 md:px-5 md:py-4 border rounded-xl md:rounded-2xl bg-slate-50 font-bold">
                        <option>Class 10</option><option>Class 9</option><option>Class 8</option><option>Class 7</option><option>Class 6</option><option>Class 5</option>
                     </select>
                     <input value={matUrl} onChange={(e) => setMatUrl(e.target.value)} className="w-full px-4 py-3 md:px-5 md:py-4 border rounded-xl md:rounded-2xl bg-slate-50 font-bold" placeholder="URL (PDF link or Drive link)" />
                     <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl hover:bg-black transition uppercase tracking-widest">
                        {loading ? 'Uploading...' : 'Publish Content'}
                     </button>
                  </form>
               </div>
               <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 md:mb-8 uppercase">Live Directory</h3>
                  <div className="space-y-3 md:space-y-4">
                     {materials.map(m => (
                        <div key={m.id} className="p-4 md:p-5 border border-slate-100 rounded-xl md:rounded-2xl flex justify-between items-center bg-slate-50 hover:bg-white hover:shadow-md transition group">
                           <div className="min-w-0 flex items-center pr-4">
                              <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-[10px] md:text-xs shrink-0"><i className={m.type === 'pdf' ? 'fas fa-file-pdf' : 'fab fa-google-drive'}></i></div>
                              <div className="truncate">
                                 <p className="text-[9px] md:text-[10px] font-black uppercase text-blue-600 leading-none mb-1">{m.class}</p>
                                 <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate">{m.title}</h4>
                              </div>
                           </div>
                           <button onClick={() => deleteMaterial(m.id)} className="text-red-300 hover:text-red-600 p-2 transition shrink-0"><i className="fas fa-trash-alt"></i></button>
                        </div>
                     ))}
                     {materials.length === 0 && <p className="text-slate-300 italic text-center py-10 text-sm">No materials published yet.</p>}
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
