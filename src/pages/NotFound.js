import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Mail } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-accent flex items-center justify-center">
      <div className="text-center">
        {/* 404 Graphic */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary mb-2">404</div>
          <div className="text-xl text-gray-600">Page Not Found</div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Oops! The page you're looking for doesn't exist.
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you are trying to reach might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-primary mb-4">Need Help?</h2>
          <p className="text-gray-600 text-sm mb-4">
            If you're looking for something specific, try our search or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
            
            <Link
              to="/contact"
              className="flex-1 btn-accent text-sm flex items-center justify-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-primary mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <Link
              to="/"
              className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <span className="text-sm font-medium text-primary">Home</span>
            </Link>
            <Link
              to="/customer/services"
              className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <span className="text-sm font-medium text-primary">Services</span>
            </Link>
            <Link
              to="/about"
              className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <span className="text-sm font-medium text-primary">About</span>
            </Link>
            <Link
              to="/contact"
              className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <span className="text-sm font-medium text-primary">Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
