
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#E0F2FE] min-h-screen relative overflow-x-hidden">
      {/* Side Label - Vertical "OPEN IN All Version" - Hidden on mobile */}
      <div className="hidden lg:fixed right-0 top-1/2 transform -translate-y-1/2 rotate-180 lg:flex items-center z-50 pointer-events-none">
        <div className="bg-red-800 text-white px-4 py-3 text-xl font-black uppercase tracking-[0.3em] whitespace-nowrap shadow-2xl" style={{ writingMode: 'vertical-rl' }}>
           OPEN IN All Version
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between border-b-4 border-cyan-400 pb-8 md:pb-12 mb-8 md:mb-12 gap-8">
           <div className="relative text-center lg:text-left flex-grow w-full">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-red-600 tracking-tight leading-[1.1] drop-shadow-sm">
                {t.heroTitle}
              </h1>
              <p className="mt-4 text-blue-900 font-bold text-lg md:text-2xl uppercase tracking-widest opacity-80">
                Building Excellence Since 2010
              </p>
           </div>
           
           <div className="flex flex-col items-center w-full max-w-sm">
              <div className="bg-[#E0F2FE] p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 border-cyan-300 shadow-2xl flex flex-col items-center transform hover:scale-105 transition duration-300 w-full">
                 <Logo className="h-40 sm:h-48 md:h-56" showText={true} />
              </div>
           </div>
        </div>

        {/* WBBSE Sub-header Banner */}
        <div className="bg-white border-2 md:border-4 border-blue-900 p-6 md:p-12 rounded-2xl md:rounded-[3rem] mb-8 md:mb-12 shadow-sm relative overflow-hidden text-center">
           <div className="absolute top-0 left-0 w-full h-1 md:h-2 bg-cyan-400"></div>
           <h2 className="text-xl sm:text-2xl md:text-5xl font-black text-cyan-500 uppercase tracking-wider md:tracking-widest drop-shadow-sm mb-4">
             {t.heroSubtitle}
           </h2>
           <div className="h-1 w-24 bg-red-600 mx-auto rounded-full"></div>
           <p className="mt-6 text-slate-600 font-bold text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
             Providing comprehensive academic support for students across West Bengal with modern learning methodologies.
           </p>
        </div>

        {/* Online Classes Banner */}
        <div className="bg-[#1E3A8A] text-white py-4 md:py-6 px-4 md:px-10 rounded-xl md:rounded-2xl mb-10 md:mb-16 shadow-2xl transform md:-skew-x-2">
           <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-center tracking-[0.1em] md:tracking-[0.2em] uppercase italic drop-shadow-lg">
             {t.onlineClasses}
           </h3>
        </div>

        {/* Two-Column Info Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-12 md:mb-20">
           {/* Left Column: Fees and Times */}
           <div className="bg-white p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border-2 md:border-4 border-cyan-200 shadow-xl space-y-8 md:space-y-12 relative flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 md:border-b-4 border-gray-100 pb-8 gap-6">
                 <div className="w-full sm:w-auto">
                    <span className="text-lg md:text-2xl font-black uppercase text-gray-900">{t.classes}</span>
                    <span className="text-3xl md:text-5xl font-black text-red-600 block mt-1 tracking-tighter">5TH to 10th</span>
                 </div>
                 <div className="text-left sm:text-right w-full sm:w-auto">
                    <span className="text-lg md:text-2xl font-black uppercase text-gray-900 block">{t.fees}</span>
                    <span className="text-3xl md:text-5xl font-black text-red-600 block mt-1 tracking-tighter">250/300/350</span>
                 </div>
              </div>

              <div className="space-y-12">
                 <div className="flex flex-col items-center sm:items-start bg-slate-50 p-6 md:p-8 rounded-2xl border-l-8 border-blue-900">
                    <span className="text-lg md:text-2xl font-black uppercase text-gray-900 tracking-wider flex items-center">
                      <i className="fas fa-clock mr-3 text-blue-900"></i> {t.classTime}
                    </span>
                    <span className="text-xl sm:text-2xl md:text-4xl font-black text-blue-900 italic mt-3 border-b-4 border-blue-900/20 pb-1">7 A.M TO 9 P.M</span>
                 </div>

                 <div className="space-y-6">
                    <span className="text-lg md:text-2xl font-black text-gray-900 block border-l-4 md:border-l-8 border-red-600 pl-4 uppercase tracking-tight">Direct Admission Support</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xl sm:text-2xl md:text-3xl font-black text-gray-800 font-mono">
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center">
                          <i className="fab fa-whatsapp text-green-600 mr-3"></i> 9832878993
                       </div>
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center">
                          <i className="fab fa-whatsapp text-green-600 mr-3"></i> 8101321954
                       </div>
                       <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center sm:col-span-2">
                          <i className="fab fa-whatsapp text-green-600 mr-3"></i> 9339958434
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Subjects & Features */}
           <div className="flex flex-col space-y-4 md:space-y-8">
              <div className="bg-blue-700 text-white p-6 md:p-8 rounded-xl md:rounded-2xl font-black text-xl md:text-3xl uppercase tracking-wider md:tracking-widest text-center shadow-lg border-b-4 md:border-b-8 border-blue-900 flex items-center justify-center">
                 <i className="fas fa-graduation-cap mr-4"></i> ACADEMIC SESSION 2026
              </div>
              <div className="bg-blue-900 text-white p-6 md:p-8 rounded-xl md:rounded-2xl font-black text-xl md:text-3xl uppercase tracking-wider md:tracking-widest text-center shadow-lg">
                 {t.subjects} Arts, Science, All
              </div>
              <div className="bg-blue-500 text-white p-6 md:p-8 rounded-xl md:rounded-2xl font-black text-xl md:text-3xl uppercase tracking-wider md:tracking-widest text-center shadow-lg border-b-4 md:border-b-8 border-blue-700">
                 {t.regFee}
              </div>

              <div className="bg-white p-8 md:p-12 rounded-2xl md:rounded-[2.5rem] border-2 md:border-4 border-cyan-200 shadow-xl flex-grow">
                 <h4 className="text-xl md:text-2xl font-black text-blue-900 mb-8 uppercase tracking-tighter border-b-2 border-slate-100 pb-4">Exclusive Features</h4>
                 <ul className="space-y-6 md:space-y-8">
                    {t.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start text-lg md:text-2xl font-black text-gray-800 group">
                         <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4 md:mr-6 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                           <i className="fas fa-check text-sm md:text-lg"></i>
                         </div>
                         <span className="leading-tight pt-1">{f}</span>
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        {/* Registration instruction bar */}
        <div className="bg-white border-2 md:border-4 border-black p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-center shadow-2xl mb-12 md:mb-16 ring-4 md:ring-8 ring-cyan-50">
           <p className="text-lg sm:text-xl md:text-3xl font-black text-red-600 leading-relaxed uppercase tracking-tight">
              {t.whatsappMsg}
           </p>
        </div>

        {/* Final CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 mb-6 md:mb-10">
           <Link to="/courses" className="w-full sm:w-auto bg-blue-900 text-white px-10 md:px-20 py-5 md:py-8 rounded-2xl md:rounded-3xl font-black text-xl md:text-3xl hover:bg-black transition shadow-2xl transform active:scale-95 text-center uppercase tracking-[0.1em]">
              {t.courses}
           </Link>
           <Link to="/signup" className="w-full sm:w-auto bg-red-600 text-white px-10 md:px-20 py-5 md:py-8 rounded-2xl md:rounded-3xl font-black text-xl md:text-3xl hover:bg-red-700 transition shadow-2xl transform active:scale-95 text-center uppercase tracking-[0.1em]">
              {t.signup}
           </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
