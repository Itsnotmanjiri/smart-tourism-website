import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div 
      className={`
        backdrop-blur-xl bg-white/90 
        rounded-3xl shadow-2xl border border-white/40
        ${hover ? 'hover:shadow-3xl hover:scale-[1.02] transition-all duration-300' : ''}
        ${className}
      `}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {children}
    </div>
  );
}

interface NatureBackgroundProps {
  imageUrl: string;
  overlay?: 'light' | 'dark' | 'gradient';
  children: ReactNode;
  className?: string;
}

export function NatureBackground({ imageUrl, overlay = 'light', children, className = '' }: NatureBackgroundProps) {
  const overlayClasses = {
    light: 'bg-white/30',
    dark: 'bg-black/40',
    gradient: 'bg-gradient-to-b from-white/20 via-transparent to-white/40'
  };

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Nature Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay */}
      <div className={`fixed inset-0 z-0 ${overlayClasses[overlay]}`} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function FloatingGradientCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-3xl p-8
        bg-gradient-to-br from-white/95 via-white/90 to-white/85
        backdrop-blur-2xl shadow-2xl
        border border-white/50
        hover:shadow-3xl hover:-translate-y-1
        transition-all duration-500
        ${className}
      `}
      style={{
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
      }}
    >
      {/* Animated Gradient Orb */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-green-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function AnimatedButton({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  icon
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
  icon?: ReactNode;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800',
    secondary: 'bg-gradient-to-r from-purple-600 via-purple-700 to-pink-700 hover:from-purple-700 hover:to-pink-800',
    success: 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:to-emerald-800',
    danger: 'bg-gradient-to-r from-red-600 via-red-700 to-rose-700 hover:from-red-700 hover:to-rose-800'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${variants[variant]}
        text-white px-6 py-3 rounded-2xl
        shadow-lg hover:shadow-2xl
        transform hover:scale-105 active:scale-95
        transition-all duration-300
        flex items-center gap-3 justify-center
        relative overflow-hidden group
        ${className}
      `}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
