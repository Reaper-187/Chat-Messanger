import React from "react";
import "./spinner.css";
const Sinpper = () => {
  return (
    <div className="flex self-center">
      <div className="relative flex flex-col w-fit">
        <span className="loader"></span>

        <img
          src="./loadingSpinner.png"
          alt="loading"
          className="absolute rotate-y-180 -bottom-20 left-8"
        />
      </div>
    </div>
  );
};

export default Sinpper;
