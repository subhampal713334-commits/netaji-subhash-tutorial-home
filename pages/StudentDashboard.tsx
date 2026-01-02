
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { UserProfile, LiveClass, Material, Schedule } from '../types';
import { useLanguage } from '../LanguageContext';
import { supabase } from '../supabase';

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
  const [schedule, setSchedule] = useState<Schedule | null>(null);
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
          // Fetch Class Schedule
          const { data: schedData } = await supabase
            .from('schedules')
            .select('*')
            .eq('class', student.class)
            .maybeSingle();
          if (schedData) setSchedule(schedData as Schedule);

          // Fetch Live Classes
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

          // Fetch Materials
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
    { name: t.schedule, path: 'schedule', icon: 'fa-calendar-alt' },
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
        <Link 
          to="/" 
          className="flex items-center px-6 py-4 text-sm font-black text-cyan-300 hover:bg-blue-800 transition-all border-b border-blue-800/50"
        >
          <i className="fas fa-globe w-5 mr-3"></i> {t.home}
        </Link>

        {sidebarLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path} 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center px-6 py-4 text-sm font-bold transition-all ${isActive(link.path) ? 'bg-blue-800 border-l-8 border-red-600 text-white' : 'text-blue-100 hover:bg-blue-800/50'}`}
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
      <div className="flex flex-col items-center">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p className="text-blue-900 font-bold animate-pulse">Loading Your Dashboard...</p>
      </div>
    </div>
  );

  if (currentUser.status === 'pending') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-yellow-100 p-8 rounded-full mb-6 shadow-inner"><i className="fas fa-clock text-6xl text-yellow-600 animate-pulse"></i></div>
        <h1 className="text-3xl font-black text-blue-900 mb-4 uppercase">{t.waitApproval}</h1>
        <p className="text-gray-600 max-w-md text-lg">{t.statusPending}</p>
        <button onClick={onLogout} className="mt-10 text-red-600 font-bold border-2 border-red-600 px-8 py-3 rounded-xl hover:bg-red-50 transition">{t.logout}</button>
      </div>
    );
  }

  if (currentUser.status === 'rejected') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-100 p-8 rounded-full mb-6 shadow-inner"><i className="fas fa-times-circle text-6xl text-red-600"></i></div>
        <h1 className="text-3xl font-black text-red-600 mb-4 uppercase">Access Denied</h1>
        <p className="text-gray-600 max-w-md text-lg">{t.statusRejected}</p>
        <button onClick={onLogout} className="mt-10 text-red-600 font-bold border-2 border-red-600 px-8 py-3 rounded-xl hover:bg-red-50 transition">{t.logout}</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col md:flex-row relative">
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center shadow-lg z-50">
        <span className="text-lg font-black tracking-tighter">NST HOME</span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
          <i className="fas fa-bars text-2xl"></i>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 bg-blue-900 h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col shadow-2xl h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-cyan-100 gap-4">
           <div>
              <h2 className="text-xl md:text-2xl font-black text-blue-900 leading-none mb-1">{t.dashboard}</h2>
              <p className="text-gray-500 font-bold text-[10px] md:text-sm uppercase tracking-widest">{currentUser.name} • {currentUser.className}</p>
           </div>
           <span className="bg-green-100 text-green-700 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-black uppercase shadow-sm">Verified Student</span>
        </header>

        <Routes>
          <Route index element={
            <div className="space-y-6 md:space-y-8">
              {activeLiveClass && isWithinTime ? (
                <div className="bg-red-600 text-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block group-hover:scale-110 transition-transform"><i className="fas fa-video text-9xl"></i></div>
                   <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left w-full">
                         <div className="flex items-center justify-center md:justify-start mb-2">
                            <span className="w-2.5 h-2.5 bg-white rounded-full mr-2 animate-ping"></span>
                            <span className="font-black uppercase tracking-widest text-[10px] md:text-sm">{t.liveNow}</span>
                         </div>
                         <h3 className="text-2xl md:text-4xl font-black leading-tight mb-2">{activeLiveClass.title}</h3>
                         <p className="text-red-100 font-bold text-sm md:text-base">Class Started at {new Date(activeLiveClass.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <a href={activeLiveClass.meet_link} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto bg-white text-red-600 px-8 py-4 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:bg-red-50 transition shadow-2xl text-center">
                        {t.joinClass}
                      </a>
                   </div>
                </div>
              ) : (
                <div className="bg-white p-8 md:p-12 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-cyan-200 text-center shadow-sm">
                   <div className="bg-slate-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6"><i className="fas fa-video-slash text-2xl md:text-3xl text-gray-300"></i></div>
                   <h3 className="text-xl md:text-2xl font-black text-gray-400 mb-2 uppercase tracking-wide">No Active Live Session</h3>
                   <p className="text-gray-400 font-bold text-sm md:text-base">Please wait for your teacher to start the class.</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                 {/* QUICK SCHEDULE VIEW */}
                 <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-cyan-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                       <h3 className="font-black text-blue-900 uppercase tracking-wider flex items-center text-lg md:text-xl"><i className="fas fa-calendar-alt mr-3 text-blue-600 text-xl md:text-2xl"></i> {t.schedule}</h3>
                       <Link to="schedule" className="text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-widest hover:underline">Full View</Link>
                    </div>
                    {schedule ? (
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <pre className="text-sm font-bold text-gray-700 whitespace-pre-wrap font-sans">{schedule.content}</pre>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-300 italic text-sm">No schedule uploaded for {currentUser.className}.</div>
                    )}
                 </div>

                 <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-cyan-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                       <h3 className="font-black text-blue-900 uppercase tracking-wider flex items-center text-lg md:text-xl"><i className="fas fa-file-pdf mr-3 text-red-600 text-xl md:text-2xl"></i> Resources</h3>
                       <Link to="materials" className="text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-widest hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                       {materials.slice(0, 4).map(m => (
                         <div key={m.id} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:bg-blue-50 transition group">
                            <div className="flex items-center min-w-0 mr-4">
                               <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center shadow-sm mr-3 text-blue-600 shrink-0"><i className={m.type === 'pdf' ? 'fas fa-file-pdf' : 'fab fa-google-drive'}></i></div>
                               <span className="font-bold text-gray-800 text-sm md:text-base truncate">{m.title}</span>
                            </div>
                            <a href={m.resource_url} target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-black text-[10px] uppercase shadow-sm group-hover:bg-blue-600 group-hover:text-white transition whitespace-nowrap">View</a>
                         </div>
                       ))}
                       {materials.length === 0 && <div className="text-center py-10 text-gray-300 italic text-sm">No study materials found for your class.</div>}
                    </div>
                 </div>
              </div>
            </div>
          } />

          <Route path="schedule" element={
            <div className="bg-white p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border border-cyan-100 min-h-[500px] shadow-sm">
               <div className="mb-8 md:mb-12 border-b-4 border-blue-900 pb-4 inline-block">
                  <h3 className="text-2xl md:text-3xl font-black text-blue-900 uppercase tracking-tight">{t.classSchedule}</h3>
                  <p className="text-gray-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-1">Weekly Plan for {currentUser.className}</p>
               </div>
               {schedule ? (
                 <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100 shadow-inner">
                    <pre className="text-lg md:text-2xl font-bold text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{schedule.content}</pre>
                    <div className="mt-8 pt-8 border-t border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      Last Updated: {new Date(schedule.updated_at).toLocaleDateString()} at {new Date(schedule.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-24 opacity-20 text-gray-400">
                    <i className="fas fa-calendar-times text-6xl md:text-8xl mb-6"></i>
                    <p className="text-xl md:text-2xl font-black uppercase tracking-widest">No schedule found</p>
                 </div>
               )}
            </div>
          } />

          <Route path="materials" element={
            <div className="bg-white p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border border-cyan-100 min-h-[500px] shadow-sm">
               <div className="mb-8 md:mb-12 border-b-4 border-blue-900 pb-4 inline-block">
                  <h3 className="text-2xl md:text-3xl font-black text-blue-900 uppercase tracking-tight">Resource Library</h3>
                  <p className="text-gray-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mt-1">Exclusive Content for {currentUser.className}</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {materials.map(m => (
                    <div key={m.id} className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 group">
                       <div className={`w-16 h-16 md:w-20 md:h-20 ${m.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl mb-4 md:mb-6 shadow-sm group-hover:rotate-6 transition-transform`}>
                          <i className={m.type === 'pdf' ? 'fas fa-file-pdf' : 'fab fa-google-drive'}></i>
                       </div>
                       <h4 className="font-black text-lg text-gray-800 mb-2 leading-tight h-12 overflow-hidden">{m.title}</h4>
                       <div className="w-10 h-1 bg-gray-200 mb-4 md:mb-6 rounded-full"></div>
                       <a href={m.resource_url} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-900 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-lg hover:bg-black transition-colors">Open Resource</a>
                    </div>
                  ))}
               </div>
               {materials.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-24 opacity-20 text-gray-400">
                    <i className="fas fa-folder-open text-6xl md:text-8xl mb-6"></i>
                    <p className="text-xl md:text-2xl font-black uppercase tracking-widest">Library is empty</p>
                 </div>
               )}
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
