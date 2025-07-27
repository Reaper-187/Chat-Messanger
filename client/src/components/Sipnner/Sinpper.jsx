import React from "react";

const Sinpper = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <img
          src="./loadingSpinner.png"
          alt="loading"
          className="w-10 rotate-y-180 lg:w-20"
          loading="lazy"
        />
        <p className="flex">
          {"Loading".split("").map((char, index) => (
            <span
              key={index}
              className="mx-1 animate-letter-fade opacity-0 lg:mx-3"
              style={{
                animationDelay: `${index * 0.1}s`,
                display: "inline-block",
              }}
            >
              {char}
            </span>
          ))}
        </p>
        <div className="flex">
          <img
            src="./speachBubble.png"
            alt="Chat-Bubble 1"
            className="w-20 scale-[0.3]
        animate-bubble-rise
        opacity-0 
        rotate-z-180
        lg:scale-[0.5] lg:w-30
        "
            style={{
              animationFillMode: "forwards",
              animationDelay: "0.5s",
            }}
            loading="lazy"
          />

          <img
            src="./speachBubble.png"
            alt="Chat-Bubble 2"
            className="w-20 scale-[0.3]
        animate-bubble-rise
        opacity-0 lg:scale-[0.5] lg:w-30 
        "
            style={{
              animationFillMode: "forwards",
              animationDelay: "2s",
            }}
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
};

export default Sinpper;
