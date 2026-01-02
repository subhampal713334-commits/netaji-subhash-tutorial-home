
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserProfile } from '../types';
import { useLanguage } from '../LanguageContext';
import Logo from './Logo';

interface HeaderProps {
  user: UserProfile | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t.home, path: '/' },
    { name: t.courses, path: '/courses' },
    { name: t.about, path: '/about' },
    { name: t.contact, path: '/contact' },
  ];

  const activeStyle = "text-red-600 font-bold border-b-2 border-red-600 pb-1";
  const inactiveStyle = "text-blue-900 hover:text-red-600 transition font-bold";

  return (
    <nav className="bg-[#E0F2FE] border-b border-cyan-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          <div className="flex items-center min-w-0">
            <Link to="/" className="flex items-center">
              <Logo className="h-12 md:h-16" showText={false} />
              <div className="ml-2 md:ml-3 flex flex-col min-w-0">
                <span className="text-sm sm:text-lg md:text-xl font-black text-red-600 leading-tight truncate">NETAJI SUBHASH</span>
                <span className="text-[10px] sm:text-xs md:text-sm text-blue-900 font-bold tracking-widest uppercase truncate">TUTORIAL HOME</span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path}
                className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
              >
                {link.name}
              </NavLink>
            ))}
            
            <div className="flex items-center bg-white rounded-full p-1 border border-cyan-300 shadow-inner">
               <button 
                 onClick={() => setLanguage('en')} 
                 className={`px-3 py-1 rounded-full text-xs font-black transition ${language === 'en' ? 'bg-blue-800 text-white' : 'text-gray-400'}`}
               >
                 EN
               </button>
               <button 
                 onClick={() => setLanguage('bn')} 
                 className={`px-3 py-1 rounded-full text-xs font-black transition ${language === 'bn' ? 'bg-blue-800 text-white' : 'text-gray-400'}`}
               >
                 বাং
               </button>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/student'} className="bg-red-600 text-white px-5 py-2 rounded-lg font-black hover:bg-red-700 transition shadow-md whitespace-nowrap">
                  {t.dashboard}
                </Link>
                <button onClick={onLogout} className="text-blue-900 font-black hover:text-red-600 whitespace-nowrap">{t.logout}</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-blue-900 font-black hover:text-red-600 whitespace-nowrap">{t.login}</Link>
                <Link to="/signup" className="bg-blue-800 text-white px-6 py-2 rounded-lg font-black hover:bg-blue-900 transition shadow-lg whitespace-nowrap">
                  {t.signup}
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-full p-1 border border-cyan-300 shadow-inner scale-90">
               <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded-full text-[10px] font-black ${language === 'en' ? 'bg-blue-800 text-white' : 'text-gray-400'}`}>EN</button>
               <button onClick={() => setLanguage('bn')} className={`px-2 py-1 rounded-full text-[10px] font-black ${language === 'bn' ? 'bg-blue-800 text-white' : 'text-gray-400'}`}>বাং</button>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-blue-900 focus:outline-none p-2">
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#E0F2FE] border-t border-cyan-100 p-6 space-y-4 shadow-2xl absolute w-full left-0 animate-in fade-in slide-in-from-top-4 duration-300">
           {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-blue-900 text-lg font-bold py-3 border-b border-cyan-100 hover:text-red-600"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col space-y-4">
             {user ? (
               <>
                 <Link 
                   to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/student'} 
                   onClick={() => setIsOpen(false)}
                   className="text-center font-black bg-red-600 text-white py-3 rounded-xl shadow-lg"
                 >
                   {t.dashboard}
                 </Link>
                 <button 
                   onClick={() => { onLogout(); setIsOpen(false); }}
                   className="text-center font-bold text-blue-900 py-2"
                 >
                   {t.logout}
                 </button>
               </>
             ) : (
               <>
                 <Link to="/login" onClick={() => setIsOpen(false)} className="text-center font-bold text-blue-900 py-3 border-2 border-blue-900 rounded-xl">Login</Link>
                 <Link to="/signup" onClick={() => setIsOpen(false)} className="text-center font-black bg-blue-900 text-white py-4 rounded-xl shadow-lg">Sign Up</Link>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
