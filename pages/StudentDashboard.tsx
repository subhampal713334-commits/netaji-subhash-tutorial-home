
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { UserProfile, LiveClass, Material } from '../types.ts';
import { useLanguage } from '../LanguageContext.tsx';
import { supabase } from '../supabase.ts';

interface StudentDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<UserProfile>(user);
  const [activeLiveClass, setActiveLiveClass] = useState<LiveClass | null>(null);
  const [isWithinTime, setIsWithinTime] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchData = async () => {
    try {
      const { data: student, error: stdError } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (stdError) throw stdError;

      if (student) {
        setCurrentUser({
          ...user,
          status: student.status as any,
          className: student.class
        });

        if (student.status === 'approved') {
          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('*')
            .eq('class', student.class)
            .order('start_time', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (classError) throw classError;

          if (classData) {
            const now = new Date();
            const start = new Date(classData.start_time);
            const end = new Date(classData.end_time);
            setActiveLiveClass(classData as LiveClass);
            setIsWithinTime(now >= start && now <= end);
          } else {
            setActiveLiveClass(null);
            setIsWithinTime(false);
          }

          const { data: matData, error: matError } = await supabase
            .from('materials')
            .select('*')
            .eq('class', student.class)
            .order('created_at', { ascending: false });

          if (matError) throw matError;
          if (matData) setMaterials(matData as Material[]);
        }
      }
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [user.id]);

  const sidebarLinks = [
    { name: t.dashboard, path: '', icon: 'fa-home' },
    { name: 'Live Classes', path: 'live', icon: 'fa-video' },
    { name: 'Study Materials', path: 'materials', icon: 'fa-file-pdf' },
  ];

  const isActive = (path: string) => {
    const fullPath = `/dashboard/student${path ? '/' + path : ''}`;
    return location.pathname === fullPath;
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-blue-800 flex items-center justify-between md:block">
        <span className="text-xl font-black tracking-tighter text-white">NST HOME</span>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-white p-2">
          <i className="fas fa-times text-2xl"></i>
        </button>
      </div>
      <nav className="flex-grow mt-4">
        <Link to="/" className="flex items-center px-6 py-4 text-sm font-bold text-blue-100 hover:bg-blue-800 transition-all">
          <i className="fas fa-globe w-5 mr-3"></i> {t.home}
        </Link>
        {sidebarLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path} 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center px-6 py-4 text-sm font-bold transition-all ${isActive(link.path) ? 'bg-blue-800 border-l-4 border-white text-white' : 'text-blue-100 hover:bg-blue-800/50'}`}
          >
            <i className={`fas ${link.icon} w-5 mr-3`}></i> {link.name}
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t border-blue-800">
        <button onClick={onLogout} className="text-red-400 font-bold flex items-center hover:text-red-300 transition w-full">
          <i className="fas fa-sign-out-alt mr-2"></i> {t.logout}
        </button>
      </div>
    </>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (currentUser.status === 'pending') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black text-blue-900 mb-4 uppercase">{t.waitApproval}</h1>
        <p className="text-gray-600 max-w-md text-lg">{t.statusPending}</p>
        <button onClick={onLogout} className="mt-10 text-red-600 font-bold border-2 border-red-600 px-8 py-3 rounded-xl hover:bg-red-50 transition">{t.logout}</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col md:flex-row relative">
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center">
        <span className="text-lg font-black tracking-tighter">NST HOME</span>
        <button onClick={() => setIsMobileMenuOpen(true)}><i className="fas fa-bars text-2xl"></i></button>
      </div>

      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col h-screen sticky top-0 shadow-xl">
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 bg-blue-900 h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      <main className="flex-grow p-4 md:p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div>
              <h2 className="text-xl font-bold text-slate-800">{t.dashboard}</h2>
              <p className="text-slate-500 text-sm font-bold uppercase">{currentUser.name} • {currentUser.className}</p>
           </div>
           <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase">Verified</span>
        </header>

        <Routes>
          <Route index element={
            <div className="space-y-8">
              {activeLiveClass && isWithinTime ? (
                <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                   <div>
                      <span className="bg-red-500 text-[10px] font-black uppercase px-2 py-1 rounded mb-2 inline-block animate-pulse">{t.liveNow}</span>
                      <h3 className="text-3xl font-black mb-2">{activeLiveClass.title}</h3>
                      <p className="text-blue-100 font-bold">Your live session is currently active.</p>
                   </div>
                   <a href={activeLiveClass.meet_link} target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition">
                     {t.joinClass}
                   </a>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                   <p className="text-slate-400 font-bold uppercase">{t.noLiveClass}</p>
                </div>
              )}

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                 <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Materials</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.slice(0, 4).map(m => (
                      <div key={m.id} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                         <div className="flex items-center min-w-0">
                            <i className={`${m.type === 'pdf' ? 'fas fa-file-pdf text-red-500' : 'fab fa-google-drive text-green-600'} text-xl mr-3`}></i>
                            <span className="font-bold text-slate-700 truncate">{m.title}</span>
                         </div>
                         <a href={m.resource_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold text-sm">Open</a>
                      </div>
                    ))}
                    {materials.length === 0 && <p className="text-slate-400 italic">No materials uploaded yet.</p>}
                 </div>
              </div>
            </div>
          } />
          
          <Route path="live" element={
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
              <h2 className="text-2xl font-bold mb-6">Live Classes</h2>
              {activeLiveClass ? (
                 <div className="max-w-md mx-auto p-6 border rounded-2xl">
                    <h3 className="text-xl font-bold mb-2">{activeLiveClass.title}</h3>
                    <p className="text-slate-500 mb-6">Grade: {activeLiveClass.class}</p>
                    {isWithinTime ? (
                       <a href={activeLiveClass.meet_link} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700">{t.joinClass}</a>
                    ) : (
                       <p className="text-red-500 font-bold italic">{new Date() < new Date(activeLiveClass.start_time) ? t.classNotStarted : t.classEnded}</p>
                    )}
                 </div>
              ) : <p className="text-slate-400">{t.noLiveClass}</p>}
            </div>
          } />

          <Route path="materials" element={
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <h2 className="text-2xl font-bold mb-8">Study Materials</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials.map(m => (
                    <div key={m.id} className="p-6 bg-slate-50 rounded-2xl hover:shadow-md transition">
                       <i className={`${m.type === 'pdf' ? 'fas fa-file-pdf text-red-500' : 'fab fa-google-drive text-green-600'} text-3xl mb-4`}></i>
                       <h4 className="font-bold text-slate-800 mb-4">{m.title}</h4>
                       <a href={m.resource_url} target="_blank" rel="noopener noreferrer" className="block text-center bg-blue-600 text-white py-2 rounded-lg font-bold">Download</a>
                    </div>
                  ))}
               </div>
               {materials.length === 0 && <p className="text-slate-400 text-center py-12">No resources found for your grade level.</p>}
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
