
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About Netaji Subhash Tutorial Home</h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded in 2010 with a vision to provide quality and affordable education, Netaji Subhash Tutorial Home has grown from a small local coaching center to a premier EdTech platform serving thousands of students across West Bengal.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our focus is primarily on the West Bengal Board of Secondary Education (WBBSE) curriculum. We believe that every student has the potential to excel if given the right guidance and resources.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="text-3xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">Students Taught</div>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="text-3xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">Expert Teachers</div>
              </div>
            </div>
          </div>
          <div className="relative">
             <img src="https://picsum.photos/600/400?random=20" alt="Classroom" className="rounded-3xl shadow-2xl z-10 relative" />
             <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full -z-0"></div>
             <div className="absolute -top-6 -right-6 w-48 h-48 bg-blue-600 opacity-10 rounded-full -z-0"></div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-12 text-center">
           <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600 text-2xl">
                    <i className="fas fa-heart"></i>
                 </div>
                 <h3 className="font-bold mb-2">Passion</h3>
                 <p className="text-sm text-gray-500">Driven by a love for teaching and student success.</p>
              </div>
              <div>
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-green-600 text-2xl">
                    <i className="fas fa-shield-alt"></i>
                 </div>
                 <h3 className="font-bold mb-2">Integrity</h3>
                 <p className="text-sm text-gray-500">Honest practices in pricing and education delivery.</p>
              </div>
              <div>
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-purple-600 text-2xl">
                    <i className="fas fa-lightbulb"></i>
                 </div>
                 <h3 className="font-bold mb-2">Innovation</h3>
                 <p className="text-sm text-gray-500">Adapting to modern technology for better learning.</p>
              </div>
              <div>
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-red-600 text-2xl">
                    <i className="fas fa-users"></i>
                 </div>
                 <h3 className="font-bold mb-2">Community</h3>
                 <p className="text-sm text-gray-500">Building a supportive environment for every learner.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default About;
