
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { UserProfile, LiveClass, Material, Schedule } from '../types.ts';
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
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to sort days of the week correctly
  const dayOrder: { [key: string]: number } = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7
  };

  const fetchData = async () => {
    try {
      // 1. REFRESH STUDENT STATUS & CLASS FROM DB (CRITICAL)
      // We don't rely on the local 'user' prop as it might be stale
      const { data: student, error: stdError } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (stdError) throw stdError;

      if (student) {
        // Normalize class name for clean matching
        const normalizedClass = (student.class || '').toString().trim();
        
        const updatedUser = {
          ...user,
          status: student.status as any,
          className: normalizedClass
        };
        setCurrentUser(updatedUser);

        if (student.status === 'approved') {
          // 2. Fetch Live Class (Match by trimmed class name)
          const { data: classData } = await supabase
            .from('classes')
            .select('*')
            .eq('class', normalizedClass)
            .order('start_time', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (classData) {
            const now = new Date();
            const start = new Date(classData.start_time);
            const end = new Date(classData.end_time);
            setActiveLiveClass(classData as LiveClass);
            setIsWithinTime(now >= start && now <= end);
          } else {
            setActiveLiveClass(null);
          }

          // 3. Fetch Materials (Match by trimmed class name)
          const { data: matData } = await supabase
            .from('materials')
            .select('*')
            .eq('class', normalizedClass)
            .order('created_at', { ascending: false });

          if (matData) setMaterials(matData as Material[]);

          // 4. Fetch Schedule (Match by trimmed class name)
          const { data: schData } = await supabase
            .from('schedules')
            .select('*')
            .eq('class', normalizedClass);

          if (schData) {
            // Sort by our custom dayOrder instead of alphabetically
            const sortedSchedules = (schData as Schedule[]).sort((a, b) => {
              const dayA = (a.day || '').trim();
              const dayB = (b.day || '').trim();
              return (dayOrder[dayA] || 99) - (dayOrder[dayB] || 99);
            });
            setSchedules(sortedSchedules);
          }
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
    // Poll every 10 seconds for live updates from admin
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [user.id]);

  const sidebarLinks = [
    { name: t.dashboard, path: '', icon: 'fa-home' },
    { name: 'Live Classes', path: 'live', icon: 'fa-video' },
    { name: t.schedule, path: 'schedule', icon: 'fa-calendar-alt' },
    { name: 'Study Materials', path: 'materials', icon: 'fa-file-pdf' },
  ];

  const isActive = (path: string) => {
    const fullPath = `/dashboard/student${path ? '/' + path : ''}`;
    return location.pathname === fullPath;
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-blue-800 flex items-center justify-between md:block">
        <span className="text-xl font-black tracking-tighter text-white uppercase italic">NST Portal</span>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-white p-2">
          <i className="fas fa-times text-2xl"></i>
        </button>
      </div>
      <nav className="flex-grow mt-4">
        <Link to="/" className="flex items-center px-6 py-4 text-sm font-bold text-blue-100 hover:bg-blue-800 transition-all">
          <i className="fas fa-globe w-5 mr-3"></i> Back to Website
        </Link>
        {sidebarLinks.map((link) => (
          <Link 
            key={link.path} 
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
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-blue-900 font-black animate-pulse uppercase tracking-widest text-xs">Syncing your dashboard...</p>
      </div>
    </div>
  );

  if (currentUser.status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-200 max-w-lg">
          <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            <i className="fas fa-clock"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">{t.waitApproval}</h1>
          <p className="text-slate-500 font-medium text-lg mb-8">{t.statusPending}</p>
          <div className="bg-blue-50 p-4 rounded-2xl mb-8 text-left">
            <p className="text-blue-700 text-sm font-bold">Registered Name: <span className="text-slate-900 ml-2">{currentUser.name}</span></p>
            <p className="text-blue-700 text-sm font-bold">Class Assignment: <span className="text-slate-900 ml-2">{currentUser.className}</span></p>
          </div>
          <button onClick={onLogout} className="w-full text-red-600 font-black border-2 border-red-600 px-8 py-4 rounded-2xl hover:bg-red-50 transition uppercase tracking-widest text-sm">{t.logout}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row relative">
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <span className="text-lg font-black tracking-tighter uppercase italic">NST PORTAL</span>
        <button onClick={() => setIsMobileMenuOpen(true)}><i className="fas fa-bars text-2xl"></i></button>
      </div>

      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col h-screen sticky top-0 shadow-xl">
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 bg-blue-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      <main className="flex-grow p-4 md:p-10 pb-24 md:pb-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 gap-4">
           <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight">Welcome back,<br className="sm:hidden" /> {currentUser.name.split(' ')[0]}!</h2>
              <div className="flex items-center mt-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">{currentUser.className}</span>
                <span className="mx-3 text-slate-300 text-xs">•</span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{currentUser.phone}</span>
              </div>
           </div>
           <div className="flex items-center bg-green-50 px-5 py-3 rounded-2xl border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-green-700 text-[10px] font-black uppercase tracking-widest">Connected & Active</span>
           </div>
        </header>

        <Routes>
          <Route index element={
            <div className="space-y-10">
              {activeLiveClass && isWithinTime ? (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 transform hover:scale-[1.01] transition-all border-b-8 border-indigo-900">
                   <div className="text-center lg:text-left">
                      <div className="inline-flex items-center bg-red-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full mb-6 animate-bounce shadow-xl">
                        <i className="fas fa-circle mr-2 text-[8px]"></i> {t.liveNow}
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{activeLiveClass.title}</h3>
                      <p className="text-blue-100 font-bold text-lg opacity-90 italic">Your virtual classroom is ready. Join now!</p>
                   </div>
                   <a href={activeLiveClass.meet_link} target="_blank" rel="noopener noreferrer" className="bg-white text-blue-700 px-12 py-6 rounded-[1.5rem] font-black text-xl hover:bg-blue-50 transition shadow-2xl flex items-center group whitespace-nowrap">
                     <i className="fas fa-video mr-4 group-hover:scale-110 transition"></i> {t.joinClass}
                   </a>
                </div>
              ) : (
                <div className="bg-white p-12 md:p-20 rounded-[2.5rem] border-4 border-dashed border-slate-100 text-center flex flex-col items-center shadow-inner">
                   <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                      <i className="fas fa-video-slash text-slate-200 text-4xl"></i>
                   </div>
                   <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">{t.noLiveClass}</p>
                   <p className="text-slate-300 text-[10px] font-bold uppercase mt-2">Checking for new classes every 10 seconds...</p>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center">
                        <i className="fas fa-calendar-alt text-blue-600 mr-4 p-4 bg-blue-50 rounded-2xl shadow-sm"></i> {t.schedule}
                      </h3>
                      <Link to="schedule" className="bg-slate-50 px-4 py-2 rounded-xl text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">Full Routine</Link>
                   </div>
                   <div className="space-y-4">
                      {schedules.slice(0, 5).map(s => (
                        <div key={s.id} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 group hover:border-blue-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                           <div className="flex items-center">
                             <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center font-black text-blue-600 text-[10px] shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                               <span>{s.day.substring(0, 3).toUpperCase()}</span>
                             </div>
                             <div className="ml-5">
                               <p className="font-black text-slate-800 uppercase text-sm leading-none">{s.subject}</p>
                               <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-tighter">{s.day}</p>
                             </div>
                           </div>
                           <span className="text-slate-700 font-mono font-bold text-xs bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">{s.time_slot}</span>
                        </div>
                      ))}
                      {schedules.length === 0 && (
                        <div className="text-center py-16">
                          <i className="fas fa-calendar-times text-slate-100 text-6xl mb-4"></i>
                          <p className="text-slate-400 italic font-bold text-sm">No schedule posted for {currentUser.className} yet.</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center">
                        <i className="fas fa-file-pdf text-red-600 mr-4 p-4 bg-red-50 rounded-2xl shadow-sm"></i> Library
                      </h3>
                      <Link to="materials" className="bg-slate-50 px-4 py-2 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm">All Files</Link>
                   </div>
                   <div className="space-y-4">
                      {materials.slice(0, 5).map(m => (
                        <div key={m.id} className="p-5 bg-slate-50/50 rounded-[1.5rem] flex justify-between items-center border border-slate-100 hover:border-red-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                           <div className="flex items-center min-w-0 pr-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-5 shadow-sm border border-slate-100">
                                <i className={`${m.type === 'pdf' ? 'fas fa-file-pdf text-red-500' : 'fab fa-google-drive text-green-600'} text-2xl`}></i>
                              </div>
                              <span className="font-black text-slate-700 truncate text-sm uppercase tracking-tight">{m.title}</span>
                           </div>
                           <a href={m.resource_url} target="_blank" rel="noopener noreferrer" className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-xl text-white hover:bg-blue-700 transition shadow-lg shrink-0">
                             <i className="fas fa-arrow-right text-xs"></i>
                           </a>
                        </div>
                      ))}
                      {materials.length === 0 && (
                        <div className="text-center py-16">
                          <i className="fas fa-folder-open text-slate-100 text-6xl mb-4"></i>
                          <p className="text-slate-400 italic font-bold text-sm">Study materials will appear here soon.</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          } />
          
          <Route path="live" element={
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-200 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-black mb-12 uppercase tracking-tight flex items-center justify-center">
                <i className="fas fa-play-circle text-blue-600 mr-4"></i> Classroom Portal
              </h2>
              {activeLiveClass ? (
                 <div className="bg-slate-50 p-8 md:p-16 rounded-[3rem] border-2 border-slate-100 relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-8 py-3 rounded-bl-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
                      {activeLiveClass.class}
                    </div>
                    <h3 className="text-4xl font-black mb-6 text-slate-900 leading-tight">{activeLiveClass.title}</h3>
                    <div className="h-2 w-24 bg-blue-600 mx-auto rounded-full mb-10"></div>
                    
                    {isWithinTime ? (
                       <div className="space-y-10">
                          <p className="text-slate-500 font-bold text-xl mb-10 italic">The class is currently in progress. Your teacher is waiting!</p>
                          <a href={activeLiveClass.meet_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-blue-600 text-white px-20 py-7 rounded-[2rem] font-black text-2xl hover:bg-blue-700 transition shadow-2xl uppercase tracking-widest hover:scale-105 active:scale-95">
                            <i className="fab fa-google mr-4"></i> JOIN NOW
                          </a>
                       </div>
                    ) : (
                       <div className="p-10 bg-red-50 rounded-[2.5rem] border-2 border-red-100">
                          <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-6"></i>
                          <p className="text-red-700 font-black text-2xl italic uppercase tracking-tight">
                            {new Date() < new Date(activeLiveClass.start_time) ? 'The session has not started yet' : 'This session has ended'}
                          </p>
                          <p className="text-red-400 text-xs font-bold mt-4 uppercase tracking-widest">Keep this tab open; it will refresh automatically</p>
                       </div>
                    )}
                 </div>
              ) : (
                <div className="py-24">
                  <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                    <i className="fas fa-video-slash text-slate-100 text-6xl"></i>
                  </div>
                  <p className="text-slate-400 text-xl font-black uppercase tracking-widest italic">{t.noLiveClass}</p>
                </div>
              )}
            </div>
          } />

          <Route path="schedule" element={
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-200">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                 <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center">
                    <i className="fas fa-calendar-week text-blue-600 mr-6 p-4 bg-blue-50 rounded-2xl"></i> {t.weeklySchedule}
                 </h2>
                 <div className="bg-blue-600 px-8 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg">
                   {currentUser.className}
                 </div>
               </div>

               <div className="overflow-x-auto -mx-8 md:mx-0">
                  <table className="w-full text-left min-w-[600px]">
                     <thead>
                        <tr className="border-b-4 border-slate-50 bg-slate-50/30">
                           <th className="px-10 py-8 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">{t.day}</th>
                           <th className="px-10 py-8 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">{t.subject}</th>
                           <th className="px-10 py-8 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">{t.time}</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {schedules.map(s => (
                           <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-10 py-10 font-black text-slate-900 uppercase tracking-tight text-xl group-hover:text-blue-600 transition-colors">{s.day}</td>
                              <td className="px-10 py-10">
                                 <span className="bg-blue-100 text-blue-700 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border border-blue-200">
                                   {s.subject}
                                 </span>
                              </td>
                              <td className="px-10 py-10">
                                <span className="font-mono text-slate-600 font-bold bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 shadow-inner">{s.time_slot}</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               
               {schedules.length === 0 && (
                  <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 mt-8">
                     <i className="fas fa-calendar-times text-slate-200 text-8xl mb-8"></i>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-sm">{t.noSchedule}</p>
                     <p className="text-slate-300 text-xs mt-3 italic font-bold uppercase">Routine will be visible once your teacher uploads it.</p>
                  </div>
               )}
            </div>
          } />

          <Route path="materials" element={
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-200">
               <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center">
                    <i className="fas fa-book-reader text-blue-600 mr-6 p-4 bg-blue-50 rounded-2xl"></i> Study Library
                  </h2>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {materials.map(m => (
                    <div key={m.id} className="p-8 bg-slate-50/50 rounded-[2.5rem] hover:shadow-2xl transition-all border border-slate-100 hover:border-blue-200 hover:bg-white group">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-blue-600 transition-all border border-slate-100">
                         <i className={`${m.type === 'pdf' ? 'fas fa-file-pdf text-red-500' : 'fab fa-google-drive text-green-600'} text-3xl group-hover:text-white transition-colors`}></i>
                       </div>
                       <h4 className="font-black text-slate-800 mb-8 uppercase text-sm leading-snug h-12 overflow-hidden">{m.title}</h4>
                       <a href={m.resource_url} target="_blank" rel="noopener noreferrer" className="block text-center bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                         <i className="fas fa-cloud-download-alt mr-2"></i> OPEN FILE
                       </a>
                    </div>
                  ))}
               </div>
               {materials.length === 0 && (
                 <div className="text-center py-24">
                   <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
                     <i className="fas fa-folder-open text-slate-100 text-6xl"></i>
                   </div>
                   <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">No digital resources available for {currentUser.className} yet.</p>
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
