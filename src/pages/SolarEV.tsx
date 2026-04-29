import { motion } from 'motion/react';
import { Sun, Battery, Zap, Leaf, TrendingDown, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function SolarEV() {
  return (
    <main className="pt-32 pb-24 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none mb-8">
              Solar + EV <br/> <span className="text-primary italic">Bundles.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Achieve true energy independence. Charge your vehicle using the power of the sun and drive for free while reducing your carbon footprint to near zero.
            </p>
          </motion.div>
        </div>

        {/* How it works simple flow */}
        <div className="mb-32">
           <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                { title: "Capture", icon: <Sun />, desc: "Solar PV panels capture sunlight and convert it into green electricity." },
                { title: "Optimize", icon: <Battery />, desc: "Smart logic ensures your car charges when solar output is at its peak." },
                { title: "Drive", icon: <Zap />, desc: "Use your stored energy to power your journeys at zero cost." }
              ].map((step, i) => (
                <div key={i} className="space-y-6">
                   <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                     {step.icon}
                   </div>
                   <h3 className="text-2xl font-black tracking-tight uppercase italic">{step.title}</h3>
                   <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[250px] mx-auto">{step.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Detailed Benefits */}
        <section className="py-24 bg-slate-50 rounded-[80px] px-12 mb-32 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-24 opacity-10">
             <Sun size={400} className="text-primary" />
          </div>
          
          <div className="max-w-4xl relative z-10">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Ultimate Efficiency</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-12">The perfect synergy <br/> for your home.</h3>
            
            <div className="grid md:grid-cols-2 gap-12">
               <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                    <TrendingDown />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Zero Fuel Costs</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">On sunny days, your EV can be charged entirely from excess solar energy, removing traditional fuel or grid costs.</p>
                  </div>
               </div>
               <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                    <Leaf />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Carbon Zero</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">Drive with the peace of mind that your transportation is purely powered by renewable energy.</p>
                  </div>
               </div>
               <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                    <Info />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Smart Export</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">If you don\'t need to charge, sell your excess solar energy back to the grid for extra income.</p>
                  </div>
               </div>
               <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                    <Zap />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Battery Storage</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">Combine with home battery storage to charge your EV using solar even during the night.</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-[60px] p-12 md:p-20 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Green energy, free travel.</h2>
          <Link 
            to="/#engine"
            className="inline-flex px-12 py-6 bg-white text-primary font-bold rounded-2xl hover:bg-slate-50 transition-all text-xl shadow-2xl"
          >
            Get Solar + EV Quote
          </Link>
        </div>
      </div>
    </main>
  );
}
