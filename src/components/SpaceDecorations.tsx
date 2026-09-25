import React from 'react';

export function StarField({ className = '' }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 w-full h-full ${className}`} aria-hidden="true">
      <circle cx="10%" cy="15%" r="1.5" fill="#FFF" className="animate-pulse opacity-70" />
      <circle cx="25%" cy="40%" r="2" fill="#FDE047" className="animate-pulse opacity-80" />
      <circle cx="45%" cy="10%" r="1" fill="#38BDF8" className="opacity-60" />
      <circle cx="65%" cy="25%" r="2.5" fill="#FFF" className="animate-pulse opacity-90" />
      <circle cx="80%" cy="12%" r="1.5" fill="#A7F3D0" className="opacity-70" />
      <circle cx="92%" cy="35%" r="2" fill="#F472B6" className="animate-pulse opacity-80" />
      <circle cx="15%" cy="75%" r="1.5" fill="#FFF" className="opacity-60" />
      <circle cx="35%" cy="85%" r="2.5" fill="#A855F7" className="animate-pulse opacity-80" />
      <circle cx="55%" cy="70%" r="1" fill="#FFF" className="opacity-70" />
      <circle cx="75%" cy="80%" r="2" fill="#FDE047" className="animate-pulse opacity-90" />
      <circle cx="88%" cy="65%" r="1.5" fill="#38BDF8" className="opacity-60" />
    </svg>
  );
}

export function SaturnPlanet({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="32" rx="26" ry="8" fill="#F59E0B" fillOpacity="0.3" transform="rotate(-15 32 32)" />
      <circle cx="32" cy="32" r="16" fill="url(#saturn-grad)" />
      <ellipse cx="32" cy="32" rx="24" ry="6" stroke="#FBBF24" strokeWidth="2.5" transform="rotate(-15 32 32)" />
      <defs>
        <linearGradient id="saturn-grad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.5" stopColor="#EC4899" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AstronautBadge({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Helmet Base */}
      <circle cx="32" cy="32" r="22" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      {/* Visor */}
      <rect x="18" y="20" width="28" height="20" rx="10" fill="url(#visor-grad)" />
      <path d="M22 24 C26 22, 36 22, 40 24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      {/* Helmet Lights */}
      <circle cx="14" cy="32" r="2" fill="#38BDF8" />
      <circle cx="50" cy="32" r="2" fill="#38BDF8" />
      <defs>
        <linearGradient id="visor-grad" x1="18" y1="20" x2="46" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284C7" />
          <stop offset="0.5" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RocketIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M32 8 C40 20, 42 36, 42 46 L22 46 C22 36, 24 20, 32 8 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
      {/* Nose cone */}
      <path d="M32 8 C36 14, 38 20, 38 24 L26 24 C26 20, 28 14, 32 8 Z" fill="#EF4444" />
      {/* Window */}
      <circle cx="32" cy="32" r="5" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
      {/* Fins */}
      <path d="M22 38 L12 48 L22 46 Z" fill="#DC2626" />
      <path d="M42 38 L52 48 L42 46 Z" fill="#DC2626" />
      {/* Flame */}
      <path d="M26 46 C26 56, 32 60, 32 60 C32 60, 38 56, 38 46 Z" fill="#F59E0B" />
      <path d="M28 46 C28 52, 32 56, 32 56 C32 56, 36 52, 36 46 Z" fill="#FDE047" />
    </svg>
  );
}

export function CutePlanet({ className = 'w-10 h-10', color = 'cyan' }: { className?: string; color?: 'cyan' | 'purple' | 'amber' }) {
  const gradMap = {
    cyan: ['#06B6D4', '#3B82F6'],
    purple: ['#8B5CF6', '#EC4899'],
    amber: ['#F59E0B', '#EF4444'],
  };
  const [c1, c2] = gradMap[color] || gradMap.cyan;

  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" fill={`url(#planet-grad-${color})`} />
      <circle cx="16" cy="18" r="3" fill="#FFFFFF" opacity="0.3" />
      <circle cx="30" cy="28" r="4" fill="#000000" opacity="0.15" />
      <defs>
        <linearGradient id={`planet-grad-${color}`} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
    </svg>
  );
}
