
import React, { useState } from 'react';
import { Course, UserProfile } from '../types';

const INITIAL_COURSES: Course[] = [
  { id: '1', title: 'Class 10 - All Subjects', description: 'Comprehensive package covering Mathematics, Sciences, and Languages for WBBSE Board Exams.', price: 350, duration: '1 Year', image_url: 'https://picsum.photos/400/250?random=11' },
  { id: '2', title: 'Class 9 - Science Special', description: 'Intensive focus on Physical Science and Life Science with regular practical sessions.', price: 300, duration: '1 Year', image_url: 'https://picsum.photos/400/250?random=12' },
  { id: '3', title: 'Class 8 - Foundation', description: 'Building strong foundations in core subjects with weekly mock tests.', price: 250, duration: '1 Year', image_url: 'https://picsum.photos/400/250?random=13' },
  { id: '4', title: 'Class 7 - Primary Plus', description: 'Engaging lessons for middle school students to bridge the gap to higher standards.', price: 250, duration: '1 Year', image_url: 'https://picsum.photos/400/250?random=14' },
  { id: '5', title: 'Class 6 - Basic Bridge', description: 'Transitioning from primary to secondary school curriculum with ease.', price: 250, duration: '1 Year', image_url: 'https://picsum.photos/400/250?random=15' },
  { id: '6', title: 'Class 5 - Foundation', description: 'Introducing structured learning and exam patterns for young learners.', price: 250, duration: '1 Year', image_url: 'https://picsum.photos/400/250?random=16' },
];

interface CoursesProps {
  user: UserProfile | null;
}

const Courses: React.FC<CoursesProps> = ({ user }) => {
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const handleEnroll = (id: string) => {
    if (!user) {
      window.location.hash = '#/login';
      return;
    }
    setEnrollingId(id);
    // Simulate enrollment
    setTimeout(() => {
      alert("Enrolled successfully! You can now access materials in your dashboard.");
      setEnrollingId(null);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Courses</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tailored programs for West Bengal Board students from Class 5th to 10th. 
            Select your class and start learning today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INITIAL_COURSES.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
              <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">
                    {course.duration}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center text-gray-500 text-sm space-x-4 mb-6">
                   <span className="flex items-center">
                     <i className="fas fa-book-open mr-2"></i>
                     All Subjects
                   </span>
                   <span className="flex items-center">
                     <i className="fas fa-certificate mr-2"></i>
                     Certification
                   </span>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500 block">Starting from</span>
                  <span className="text-2xl font-bold text-blue-600">₹{course.price}</span>
                  <span className="text-gray-400 text-sm font-normal"> / month</span>
                </div>
                <button 
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrollingId === course.id}
                  className={`px-6 py-3 rounded-xl font-bold transition flex items-center ${
                    enrollingId === course.id 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:transform active:scale-95'
                  }`}
                >
                  {enrollingId === course.id ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Enrolling...
                    </>
                  ) : 'Enroll Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
