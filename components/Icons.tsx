import React from 'react';
import { 
  Clock, 
  Layers, 
  Bone, 
  Activity, 
  Dna, 
  Component, 
  Footprints, 
  Trees, 
  CircleDashed,
  Hammer,
  Flame,
  Sparkles,
  MapPin,
  HeartHandshake,
  Compass
} from 'lucide-react';

interface IconProps {
  type: string;
  className?: string;
}

/**
 * Detailed SVG Icon of a Fossil Human / Hominin Skull (Cranium with prominent brow ridge, eye orbits, and zygomatic arches)
 */
export const AncestorIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`fill-current ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cranial Vault & Sagittal Curve */}
    <path d="M32 6 C17 6 10 18 10 30 C10 39 15 44 20 47 L20 54 C20 56.5 22 58 24.5 58 L39.5 58 C42 58 44 56.5 44 54 L44 47 C49 44 54 39 54 30 C54 18 47 6 32 6 Z M23 37 C19.5 37 17 34 17 29.5 C17 25 19.5 23 23 23 C26.5 23 29 25 29 29.5 C29 34 26.5 37 23 37 Z M41 37 C37.5 37 35 34 35 29.5 C35 25 37.5 23 41 23 C44.5 23 47 25 47 29.5 C47 34 44.5 37 41 37 Z M32 46 C30.2 46 29 44 30 41.5 L31.5 38.5 C31.7 38 32.3 38 32.5 38.5 L34 41.5 C35 44 33.8 46 32 46 Z M24 51 L40 51 L40 54 L24 54 Z" fillRule="evenodd" />
  </svg>
);

// Retain DinoIcon name as alias so existing imports don't break
export const DinoIcon = AncestorIcon;

export const TechIcon: React.FC<IconProps> = ({ type, className = "" }) => {
  const commonClasses = `stroke-[1.75px] ${className}`;

  switch (type) {
    case 'era':
      return <Clock className={commonClasses} />;
    case 'geology':
      return <Layers className={commonClasses} />;
    case 'discovery':
      return <Bone className={commonClasses} />;
    case 'status':
      return <Activity className={commonClasses} />;
    case 'skull':
      return <AncestorIcon className={`w-4 h-4 ${className}`} />;
    case 'skeleton':
      return <Component className={commonClasses} />;
    case 'burial':
      return <HeartHandshake className={commonClasses} />;
    case 'footprint':
      return <Footprints className={commonClasses} />;
    case 'environment':
      return <Trees className={commonClasses} />;
    case 'tools':
      return <Hammer className={commonClasses} />;
    case 'fire':
      return <Flame className={commonClasses} />;
    default:
      return <CircleDashed className={commonClasses} />;
  }
};
