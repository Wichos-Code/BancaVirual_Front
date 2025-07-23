
import React from 'react';

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="
          animate-spin
          rounded-full
          h-12
          w-12
          border-b-2
          border-gray-900
          dark:border-white
        "
      ></div>
    </div>
  );
};