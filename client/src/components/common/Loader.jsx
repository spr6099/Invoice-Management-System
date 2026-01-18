import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

        {/* Optional Text */}
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
