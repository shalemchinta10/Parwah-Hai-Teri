import React from 'react';

export interface BrandLogoProps {
  variant?:
    | 'header'
    | 'hero'
    | 'footer'
    | 'icon-only'
    | 'stacked'
    | 'horizontal'
    | 'app-icon'
    | 'dark'
    | 'light';
  lightText?: boolean;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * Custom Standalone Brand Symbol Icon
 * Concept: "P + PEOPLE + PROTECTION"
 * - Stylized Letter 'P'
 * - Abstract Geometric Citizen Figures standing in solidarity
 * - Protective Upper Arc sheltering the community
 */
export const BrandSymbolIcon: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  isDarkBg?: boolean;
}> = ({ size = 'md', className = '', isDarkBg = false }) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${selectedSize} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Main Stem & Loop Gradient (Deep Indigo -> Royal Purple) */}
          <linearGradient id="pMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3730A3" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          {/* Protective Shelter Arc Gradient (Indigo -> Trust Blue -> Subtle Teal) */}
          <linearGradient id="pProtectiveArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>

          {/* Teal Accent Line */}
          <linearGradient id="pTealAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
        </defs>

        {/* Left Vertical Pillar Stem of the P */}
        <path
          d="M 18 16 C 24 16, 28 20, 28 26 L 28 82 C 28 88, 22 92, 18 92 C 14 92, 8 88, 8 82 L 8 26 C 8 20, 12 16, 18 16 Z"
          fill="url(#pMainGrad)"
        />

        {/* Outer Protective Loop Arc of the P (Sheltering Sweep over community) */}
        <path
          d="M 22 16 C 50 16, 92 20, 92 48 C 92 72, 58 74, 38 68 C 32 66, 30 58, 36 56 C 42 54, 78 60, 78 48 C 78 32, 48 28, 22 28 Z"
          fill="url(#pProtectiveArcGrad)"
        />

        {/* Inner Protective Accent Arc (Subtle Teal Guidance Arc) */}
        <path
          d="M 30 22 C 54 22, 84 26, 84 48 C 84 62, 62 64, 48 60"
          stroke="url(#pTealAccent)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Geometric Abstract Citizen Figures (Standing together in civic unity) */}
        {/* Person 1: Central Primary Figure */}
        <circle cx="48" cy="38" r="6" fill={isDarkBg ? "#F8FAFC" : "#1E1B4B"} />
        <path
          d="M 40 82 C 40 58, 43 47, 48 47 C 53 47, 56 58, 56 82 Z"
          fill={isDarkBg ? "#EEF2FF" : "#1E293B"}
        />

        {/* Person 2: Partner Figure (Right) */}
        <circle cx="64" cy="43" r="5" fill="#2563EB" />
        <path
          d="M 58 82 C 58 63, 60 52, 64 52 C 68 52, 70 63, 70 82 Z"
          fill="#2563EB"
        />

        {/* Person 3: Community Citizen (Left) */}
        <circle cx="34" cy="46" r="4.5" fill="#0D9488" />
        <path
          d="M 29 82 C 29 65, 31 56, 34 56 C 37 56, 39 65, 39 82 Z"
          fill="#0D9488"
        />
      </svg>
    </div>
  );
};

/**
 * App Icon Container Variant (Squircle / Mobile App Avatar)
 */
export const BrandAppIcon: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  isDarkBg?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ size = 'md', isDarkBg = false, className = '', onClick }) => {
  const containerSizes = {
    sm: 'w-10 h-10 rounded-xl p-1.5',
    md: 'w-14 h-14 rounded-2xl p-2.5',
    lg: 'w-20 h-20 rounded-3xl p-3.5',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center shrink-0 shadow-lg border transition-all duration-300 group-hover:scale-105 cursor-pointer ${
        isDarkBg
          ? 'bg-slate-950 border-slate-800 shadow-indigo-950/40'
          : 'bg-white border-slate-200/80 shadow-indigo-500/10'
      } ${containerSizes[size]} ${className}`}
    >
      <BrandSymbolIcon size={size === 'lg' ? 'xl' : size === 'md' ? 'lg' : 'sm'} isDarkBg={isDarkBg} />
    </div>
  );
};

/**
 * Wordmark Component: "Parwah Hai Teri" Script + "You're not alone." Tagline
 */
export const BrandWordmark: React.FC<{
  lightText?: boolean;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center';
}> = ({ lightText = false, showTagline = true, size = 'md', align = 'left' }) => {
  const mainTextColor = lightText ? 'text-white' : 'text-slate-900';
  const taglineColor = lightText ? 'text-slate-300' : 'text-slate-500';

  const sizeClasses = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  };

  const taglineSizeClasses = {
    sm: 'text-[9px] sm:text-[10px]',
    md: 'text-[10px] sm:text-xs',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base',
  };

  return (
    <div className={`flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
      {/* Clean, Confident Cursive Wordmark */}
      <div
        className={`flex items-baseline gap-1.5 font-['Dancing_Script','Caveat',cursive] font-bold leading-none select-none ${sizeClasses[size]}`}
      >
        {/* "Parwah" */}
        <span className={`tracking-tight transition-colors ${mainTextColor}`}>
          Parwah
        </span>

        {/* "Hai" with Indigo to Teal Gradient */}
        <span className="relative inline-block mx-0.5">
          <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-teal-600 bg-clip-text text-transparent font-black italic pr-0.5">
            Hai
          </span>
          {/* Subtle Accent Line under "Hai" */}
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full opacity-80" />
        </span>

        {/* "Teri" */}
        <span className={`tracking-tight transition-colors ${mainTextColor}`}>
          Teri
        </span>
      </div>

      {/* Tagline: "YOU'RE NOT ALONE." */}
      {showTagline && (
        <div className={`flex items-center gap-1.5 mt-1 ${taglineSizeClasses[size]}`}>
          <span className="h-px w-3 bg-gradient-to-r from-transparent to-indigo-500/40 hidden sm:inline-block" />
          <p className={`font-bold tracking-widest ${taglineColor} uppercase`}>
            You're not alone.
          </p>
          <span className="h-px w-3 bg-gradient-to-l from-transparent to-teal-500/40 hidden sm:inline-block" />
        </div>
      )}
    </div>
  );
};

/**
 * Main Flexible BrandLogo Component
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  lightText = false,
  showTagline = true,
  className = '',
  onClick,
  size,
}) => {
  const isDarkBg = variant === 'dark' || lightText;

  // Icon Only Variant
  if (variant === 'icon-only') {
    return (
      <div onClick={onClick} className={`cursor-pointer inline-block group ${className}`}>
        <BrandSymbolIcon size={size || 'md'} isDarkBg={isDarkBg} />
      </div>
    );
  }

  // App Icon Variant
  if (variant === 'app-icon') {
    return (
      <BrandAppIcon
        size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
        isDarkBg={isDarkBg}
        className={className}
        onClick={onClick}
      />
    );
  }

  // Stacked Logo Variant (Icon on top, Wordmark below, centered)
  if (variant === 'stacked') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center gap-2.5 select-none cursor-pointer group ${className}`}
      >
        <BrandSymbolIcon size={size || 'xl'} isDarkBg={isDarkBg} />
        <BrandWordmark
          lightText={isDarkBg}
          showTagline={showTagline}
          size={size === 'xl' ? 'lg' : 'md'}
          align="center"
        />
      </div>
    );
  }

  // Hero Variant
  if (variant === 'hero') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 select-none cursor-pointer group ${className}`}
      >
        <BrandSymbolIcon size="xl" isDarkBg={isDarkBg} />
        <BrandWordmark
          lightText={isDarkBg}
          showTagline={showTagline}
          size="lg"
          align="left"
        />
      </div>
    );
  }

  // Footer Variant
  if (variant === 'footer') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
      >
        <BrandSymbolIcon size="sm" isDarkBg={isDarkBg} />
        <BrandWordmark
          lightText={isDarkBg}
          showTagline={showTagline}
          size="sm"
          align="left"
        />
      </div>
    );
  }

  // Default / Header / Horizontal Variant
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer group ${className}`}
    >
      <BrandSymbolIcon size={size || 'md'} isDarkBg={isDarkBg} />
      <BrandWordmark
        lightText={isDarkBg}
        showTagline={showTagline}
        size={size || 'md'}
        align="left"
      />
    </div>
  );
};
