import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-slate-500 uppercase tracking-wider">
          <Link to="/#services" className="hover:text-primary transition-colors">Services</Link>
          <Link to="/#faq" className="hover:text-primary transition-colors">Support</Link>
          <Link to="/home-installation" className="hover:text-primary transition-colors">Residential</Link>
          <Link to="/commercial-fleet" className="hover:text-primary transition-colors">Commercial</Link>
          <Link to="/solar-ev" className="hover:text-primary transition-colors">Solar + EV</Link>
          <Link to="/ozev-grants" className="hover:text-primary transition-colors">Grants</Link>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <a 
            href="https://wa.me/447476839393" 
            className="text-slate-900 flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <MessageSquare size={16} className="text-primary group-hover:scale-110 transition-transform" />
            07476 839 393
          </a>
          <Link 
            to="/#engine"
            className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            Get Free Quote
          </Link>
        </div>
      </div>
    </nav>
  );
}
