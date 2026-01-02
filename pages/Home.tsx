
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.tsx';
import Logo from '../components/Logo.tsx';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white border-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                {t.heroTitle}
              </h1>
              <p className="text-xl text-blue-600 font-bold mb-8">
                {t.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link to="/signup" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg">
                  {t.signup}
                </Link>
                <Link to="/courses" className="bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition">
                  {t.courses}
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
                <Logo className="h-64 md:h-80 relative z-10" showText={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <i className="fas fa-calendar-alt text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t.classTime}</h3>
            <p className="text-slate-600 font-medium">7:00 AM TO 9:00 PM</p>
            <p className="text-slate-400 text-sm mt-2">Monday to Saturday</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
              <i className="fas fa-users text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t.classes}</h3>
            <p className="text-slate-600 font-medium">Class 5th to 10th</p>
            <p className="text-slate-400 text-sm mt-2">West Bengal Board (WBBSE)</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <i className="fas fa-wallet text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t.fees}</h3>
            <p className="text-slate-600 font-medium">₹250 - ₹350 / month</p>
            <p className="text-slate-400 text-sm mt-2">{t.regFee}</p>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Our Key Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.features.map((feature: string, idx: number) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl flex items-center gap-4">
                <i className="fas fa-check-circle text-blue-600"></i>
                <span className="font-bold text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-900 rounded-[2.5rem] p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <h2 className="text-2xl md:text-4xl font-black mb-6 relative z-10">{t.whatsappMsg}</h2>
          <div className="flex flex-wrap justify-center gap-8 relative z-10 text-xl md:text-2xl font-mono font-bold">
            <span className="flex items-center gap-2"><i className="fab fa-whatsapp"></i> 9832878993</span>
            <span className="flex items-center gap-2"><i className="fab fa-whatsapp"></i> 8101321954</span>
            <span className="flex items-center gap-2"><i className="fab fa-whatsapp"></i> 9339958434</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
