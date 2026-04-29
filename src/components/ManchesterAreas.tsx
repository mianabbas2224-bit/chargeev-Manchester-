import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CheckCircle2, Zap, Wifi, X } from 'lucide-react';
import { useState } from 'react';

const AREAS = [
  "City Center", "Salford", "Trafford", "Stockport", 
  "Didsbury", "Altrincham", "Bury", "Bolton", 
  "Oldham", "Rochdale", "Wigan", "Prestwich",
  "Chorlton", "Sale", "Withington", "Urmston"
];

export default function ManchesterAreas() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  return (
    <div className="space-y-8 md:space-y-12 relative">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {AREAS.map((area, i) => (
          <motion.div
            key={area}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedArea(area)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 186, 134, 0.05)', borderColor: '#00ba86' }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 md:p-6 border rounded-2xl md:rounded-[32px] transition-all cursor-pointer group relative overflow-hidden ${
              selectedArea === area ? 'bg-primary/5 border-primary shadow-[0_0_20px_rgba(0,186,134,0.1)]' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="flex items-start justify-between mb-1 md:mb-2">
              <span className={`text-[8px] md:text-[10px] font-black transition-colors ${selectedArea === area ? 'text-primary' : 'text-slate-300 group-hover:text-primary'}`}>
                0{i + 1}
              </span>
              <CheckCircle2 size={12} className={`transition-all ${selectedArea === area ? 'text-primary opacity-100 scale-100' : 'text-primary opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100'}`} />
            </div>
            <h4 className={`text-base md:text-xl font-black tracking-tighter italic uppercase transition-colors leading-tight ${selectedArea === area ? 'text-primary' : 'text-slate-900 group-hover:text-primary'}`}>
              {area}
            </h4>
            {selectedArea === area && (
              <motion.div 
                layoutId="active-bg"
                className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" 
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Area Detail Toast */}
      <AnimatePresence>
        {selectedArea && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-6 right-6 md:left-auto md:right-12 md:max-w-md z-[100] bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl border border-white/10 backdrop-blur-xl"
          >
            <button 
              onClick={() => setSelectedArea(null)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,186,134,0.4)]">
                <MapPin size={24} className="text-white" />
              </div>
              <div>
                <h5 className="text-2xl font-black italic uppercase tracking-tighter mb-0.5">{selectedArea} Hub</h5>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Connection</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Energy Peak</p>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-primary" />
                  <span className="text-lg font-black tracking-tighter text-white">98.4%</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Infrastructure</p>
                <div className="flex items-center gap-2">
                  <Wifi size={14} className="text-primary" />
                  <span className="text-lg font-black tracking-tighter text-white">READY</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              We have immediate availability for same-week installations in <span className="text-white font-bold">{selectedArea}</span>. All hardware is DNO compliant and includes our lifetime GM support.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-4 items-center justify-between pt-6 md:pt-8 border-t border-slate-100">
        <div className="flex gap-6 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Live Hubs</p>
            <p className="text-lg md:text-xl font-black text-slate-900 italic tracking-tighter">12 Active Nodes</p>
          </div>
          <div className="flex-1 sm:flex-initial">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-lg md:text-xl font-black text-primary italic tracking-tighter uppercase">Optimal Network</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-slate-400 bg-slate-50 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-slate-100 w-full sm:w-auto">
           <MapPin size={14} className="text-primary shrink-0" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Greater Manchester Operations</span>
        </div>
      </div>
    </div>
  );
}
