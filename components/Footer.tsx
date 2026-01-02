
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold">Netaji Subhash</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Educating for a Brighter Tomorrow. Providing quality education for students from Class 5th to 10th since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/courses" className="hover:text-blue-400 transition">Our Courses</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Subjects</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Mathematics</li>
              <li>Physical Science</li>
              <li>Life Science</li>
              <li>History & Geography</li>
              <li>English & Bengali</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-blue-500"></i>
                <span>Main Market, Near Railway Station, West Bengal</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone-alt text-blue-500"></i>
                <span>+91 9832878993</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-envelope text-blue-500"></i>
                <span>info@nstutorial.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Netaji Subhash Tutorial Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
