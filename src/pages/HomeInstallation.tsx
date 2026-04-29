import { motion } from 'motion/react';
import { Zap, CheckCircle2, ShieldCheck, Clock, PoundSterling, Wrench, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function HomeInstallation() {
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
              Residential <br/> <span className="text-primary italic">EV Installation.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Power your journey from the comfort of your home. We provide end-to-end installation services for homeowners across Manchester and the UK.
            </p>
          </motion.div>
        </div>

        {/* Charger Types */}
        <div className="grid md:grid-cols-2 gap-12 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-slate-50 rounded-[40px] border border-slate-100"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
              <Zap size={32} />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">7kW Fast Charging</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              The standard for home charging. Fully charge most EVs overnight (approx 8-10 hours). Compatible with single-phase domestic power supply.
            </p>
            <ul className="space-y-4">
              {["Overnight full charge", "Single-phase compatible", "Smart load balancing", "App control integration"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={18} className="text-primary" /> {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-slate-900 text-white rounded-[40px]"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-8">
              <Zap size={32} className="fill-current" />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">22kW Rapid Charging</h3>
            <p className="text-white/60 font-medium mb-8 leading-relaxed">
              Future-proof your home. Requires a 3-phase power supply. Ideal for large batteries and high-mileage drivers who need quick turnarounds.
            </p>
            <ul className="space-y-4 text-white/80">
              {["3-phase power required", "Charges 3x faster than 7kW", "Industrial grade components", "Ideal for multi-EV homes"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 size={18} className="text-primary" /> {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Why Us Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">The Chargeev Edge</h2>
            <h3 className="text-4xl font-black tracking-tight">Why Manchester chooses us.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "NICEIC Certified", desc: "Our engineers are fully certified and insured for your peace of mind.", icon: <ShieldCheck /> },
              { title: "Quick Turnaround", desc: "Installations usually completed within 5-7 working days of booking.", icon: <Clock /> },
              { title: "Price Guarantee", desc: "No hidden fees. The price we quote is the price you pay.", icon: <PoundSterling /> }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-white rounded-3xl border border-slate-100 text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-[60px] p-12 md:p-20 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Ready to power up?</h2>
          <Link 
            to="/#engine"
            className="inline-flex px-12 py-6 bg-white text-primary font-bold rounded-2xl hover:bg-slate-50 transition-all text-xl shadow-2xl"
          >
            Book Free Survey
          </Link>
        </div>
      </div>
    </main>
  );
}
