import React from 'react';

const CustomButton = ({ href = "#", text = "Button", variant = "default", rounded = false }) => {
  const commonClasses = `relative group inline-block px-8 py-3 text-white border border-white uppercase tracking-wider overflow-hidden transition-all duration-300 shadow-md hover:scale-105 ${rounded ? 'rounded-full' : ''}`;
  const icon = (
    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  const getVariant = () => {
    switch (variant) {
      case "multi-swipe":
        return (
          <a href={href} className={`bg-transparent font-semibold ${commonClasses}`}>
            <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-black">
              {text} {icon}
            </span>
            <span className="absolute inset-0 z-0 bg-primary scale-0 group-hover:scale-150 transition-transform duration-500 ease-out origin-center rounded-full"></span>
          </a>
        );
      case "multi-swipe-v2":
        return (
          <a href={href} className={`bg-transparent font-ethno ${commonClasses}`}>
            <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-black">
              {text} {icon}
            </span>
            <span className={`absolute inset-0 z-0 bg-primary scale-0 group-hover:scale-150 transition-transform duration-500 ease-out origin-center ${rounded ? 'rounded-full' : ''}`}></span>
          </a>
        );
      case "swipe":
        return (
          <a href={href} className={`bg-black font-semibold ${commonClasses}`}>
            <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-black">
              {text} {icon}
            </span>
            <span className="absolute inset-0 bg-primary transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
          </a>
        );
      case "swipe-v2":
        return (
          <a href={href} className={`bg-black font-ethno ${commonClasses}`}>
            <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-black">
              {text} {icon}
            </span>
            <span className="absolute inset-0 bg-primary transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
          </a>
        );
      case "default-v2":
        return (
          <a href={href} className={`bg-black font-ethno ${commonClasses}`}>
            <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-black">
              {text} {icon}
            </span>
            <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
          </a>
        );
      default:
        return (
          <a href={href} className={`bg-black font-semibold ${commonClasses}`}>
            <span className="relative z-10 flex items-center justify-center gap-4 group-hover:text-black">
              {text} {icon}
            </span>
            <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
          </a>
        );
    }
  };

  return getVariant();
};

export default CustomButton;