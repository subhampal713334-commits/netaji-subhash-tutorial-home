
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our courses or the enrollment process? 
            Our team is here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Phone Support</h4>
                    <p className="text-sm text-gray-500 mt-1">Mon-Sat from 7 AM to 9 PM.</p>
                    <p className="text-blue-600 font-bold mt-2">9832878993</p>
                    <p className="text-blue-600 font-bold">8101321954</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg text-green-600">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">WhatsApp</h4>
                    <p className="text-sm text-gray-500 mt-1">Send "HI" for registration link.</p>
                    <p className="text-green-600 font-bold mt-2">9339958434</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email Us</h4>
                    <p className="text-sm text-gray-500 mt-1">Typically replies within 24h.</p>
                    <p className="text-purple-600 font-bold mt-2">info@nstutorial.com</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 h-full">
               {submitted ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl">
                       <i className="fas fa-check"></i>
                    </div>
                    <h2 className="text-2xl font-bold">Message Sent!</h2>
                    <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
                    <button onClick={() => setSubmitted(false)} className="text-blue-600 font-bold underline">Send another message</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                          <input 
                            type="text" 
                            required 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                            placeholder="John Doe" 
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            required 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                            placeholder="john@example.com" 
                          />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                       <input 
                         type="text" 
                         required 
                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                         placeholder="Inquiry about Class 10 Admission" 
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                       <textarea 
                         rows={4} 
                         required 
                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                         placeholder="How can we help you?"
                       ></textarea>
                    </div>
                    <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                       Send Message
                    </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
