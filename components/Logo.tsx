
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-16", showText = true }) => {
  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-w-full drop-shadow-sm"
      >
        {/* Book - Open Pages */}
        <path
          d="M200 185 C260 170 340 190 350 195 V245 C340 240 260 220 200 235 C140 220 60 240 50 245 V195 C60 190 140 170 200 185Z"
          fill="white"
          stroke="#1A1A1A"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Book Spine Shadow */}
        <path
          d="M200 185 V235"
          stroke="#1A1A1A"
          strokeWidth="4"
        />
        {/* Page lines for detail */}
        <path d="M70 205 Q140 185 190 195" stroke="#E5E7EB" strokeWidth="2" />
        <path d="M330 205 Q260 185 210 195" stroke="#E5E7EB" strokeWidth="2" />

        {/* Graduation Cap - Top Diamond */}
        <path
          d="M200 85 L330 130 L200 175 L70 130 Z"
          fill="#1A1A1A"
          stroke="black"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Graduation Cap - Base/Headband */}
        <path
          d="M145 155 V185 Q200 195 255 185 V155"
          fill="#1A1A1A"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Tassel String */}
        <path
          d="M200 130 C240 130 270 130 285 130 C285 130 285 160 285 170"
          stroke="#F59E0B"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Pencil - Tassel attachment */}
        <g transform="translate(272, 165)">
          {/* Pencil Body */}
          <rect x="0" y="0" width="26" height="70" fill="#F59E0B" stroke="black" strokeWidth="2" rx="2" />
          <rect x="8" y="0" width="10" height="70" fill="#D97706" opacity="0.3" /> {/* Pencil detail line */}
          
          {/* Pencil Tip (Wood) */}
          <path d="M0 70 L13 95 L26 70 Z" fill="#FDE68A" stroke="black" strokeWidth="1" />
          
          {/* Pencil Lead */}
          <path d="M8 85 L13 95 L18 85 Z" fill="black" />
          
          {/* Eraser End Holder */}
          <rect x="0" y="-10" width="26" height="10" fill="#9CA3AF" stroke="black" strokeWidth="1" />
        </g>
      </svg>
      
      {showText && (
        <div className="text-center mt-2 md:mt-3 px-2">
          <h1 className="text-[#0F3D69] font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-[1.1]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            Netaji Subhash<br />Tutorial Home
          </h1>
          <p className="text-[#0F3D69] text-xs sm:text-sm md:text-base font-medium mt-1 tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
            Educating for a Brighter Tomorrow
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
