import { motion } from 'motion/react';
import { Gavel, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function Terms() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-40 pb-24 px-6 bg-slate-950 text-white relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <BackButton label="Home" />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic"
          >
            Terms of <span className="text-primary italic">Service.</span>
          </motion.h1>
          <p className="text-xl text-slate-400 mt-6 font-medium">Agreement for Manchester & London Network Installs</p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <div className="bg-slate-950 p-12 rounded-[40px] text-white mb-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-full bg-primary/10 -skew-x-12 translate-x-1/2"></div>
             <Gavel size={48} className="text-primary mb-6" />
             <h2 className="text-3xl font-black mb-6 uppercase italic">Booking Agreement</h2>
             <p className="text-slate-400 font-medium leading-relaxed">
               By requesting a quote, you acknowledge that a fixed price is only guaranteed after a successful technical site survey (digital or physical).
             </p>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mt-12 mb-6 uppercase italic">1. Installation Standards</h3>
          <p className="text-slate-600 font-medium mb-8">
            All Chargeev installations are performed to IET Wiring Regulations BS 7671 (18th Edition). We reserve the right to decline an installation if the existing property electrics (Consumer Unit) do not meet safety standards.
          </p>

          <h3 className="text-2xl font-black text-slate-900 mt-12 mb-6 uppercase italic">2. Site Surveys</h3>
          <p className="text-slate-600 font-medium mb-8">
            Our "Standard Installation" price applies to cable runs under 10 meters. Any additional work required for complex routes or fuse upgrades will be communicated clearly before work commences.
          </p>

          <h3 className="text-2xl font-black text-slate-900 mt-12 mb-6 uppercase italic">3. DNO & Approvals</h3>
          <p className="text-slate-600 font-medium mb-8">
            Grid approval is outside our direct control. If your local DNO (Distribution Network Operator) identifies grid capacity issues in your area of Salford, Bolton, or London, the installation may be delayed or require further infrastructure upgrades.
          </p>

          <h3 className="text-2xl font-black text-slate-900 mt-12 mb-6 uppercase italic">4. Cancellations</h3>
          <p className="text-slate-600 font-medium mb-8">
            Cancellations made within 48 hours of your scheduled installation slot may incur a call-out fee to cover engineer logistics.
          </p>
        </div>
      </section>
    </main>
  );
}
