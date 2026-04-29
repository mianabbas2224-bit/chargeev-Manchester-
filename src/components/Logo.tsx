import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = "", iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Unique "Volt Loop" Icon */}
      <div className="relative">
        <div className="w-11 h-11 bg-primary rounded-[14px] flex items-center justify-center transform group-hover:rotate-[10deg] transition-transform duration-500 shadow-lg shadow-primary/20">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-6 h-6 text-white" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* The Outer Loop (Manchester Network) */}
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.8.48 3.48 1.32 4.95" opacity="0.4" />
            <path d="M22 12c0 5.523-4.477 10-10 10-1.8 0-3.48-.48-4.95-1.32" />
            {/* The Core Bolt */}
            <path d="M13 2L8 12h5l-1 10 5-10h-5l1-10z" fill="white" stroke="none" />
          </svg>
        </div>
        {/* Connection Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-primary/30 blur-xl rounded-full -z-10"
        />
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Chargeev</span>
          <span className="text-[8px] font-black tracking-[0.3em] text-primary uppercase mt-0.5">
            Smart EV Charging
          </span>
        </div>
      )}
    </div>
  );
}
