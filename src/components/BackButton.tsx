import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export default function BackButton({ to = "/", label = "Back to Home" }: BackButtonProps) {
  return (
    <Link 
      to={to} 
      className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold uppercase tracking-widest text-[10px] mb-12 transition-colors group"
    >
      <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-primary transition-colors">
        <ArrowLeft size={14} />
      </div>
      {label}
    </Link>
  );
}
