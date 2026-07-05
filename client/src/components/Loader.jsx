import React from "react";

const Loader = ({ small }) => {
  return (
    <div className={`flex items-center justify-center ${small ? "py-4" : "py-20"}`}>
      <div
        className={`animate-spin rounded-full border-primary-600 border-t-transparent ${
          small ? "h-6 w-6 border-2" : "h-12 w-12 border-4"
        }`}
      ></div>
    </div>
  );
};

export default Loader;
