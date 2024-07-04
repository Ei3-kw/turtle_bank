import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 ">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex-shrink-0 flex items-center text-xl font-bold text-indigo-600">
                    Goal Saver
                  </Link>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link to="/" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/goals" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Goals
                    </Link>
                    <Link to="/analysis" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Analysis
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Profile
                  </button>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
  );
};

export default Layout;