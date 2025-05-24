import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      
      <h3 className="text-xl font-medium text-gray-800 mb-2">Finding scholarships for you</h3>
      <p className="text-gray-600 text-center max-w-md">
        We're searching through thousands of scholarships to find the perfect matches for your profile.
      </p>
    </div>
  );
};

export default LoadingState;