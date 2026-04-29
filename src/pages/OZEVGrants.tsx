import { motion } from 'motion/react';
import { ShieldCheck, PoundSterling, FileText, CheckCircle2, Info, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import GrantWizard from '../components/GrantWizard';
import BackButton from '../components/BackButton';

export default function OZEVGrants() {
  const [isGrantWizardOpen, setIsGrantWizardOpen] = useState(false);
  return (
    <main className="pt-32 pb-24 px-6 min-h-screen bg-white">
      <GrantWizard isOpen={isGrantWizardOpen} onClose={() => setIsGrantWizardOpen(false)} />
      <div className="max-w-7xl mx-auto">
        <BackButton />
        
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none mb-8">
              OZEV & <br/> <span className="text-primary italic">Government Grants.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Save up to £350 on your EV charger installation. We are OZEV approved installers, meaning we handle the entire application process for you.
            </p>
          </motion.div>
        </div>

        {/* Current Schemes */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
           <div className="p-12 bg-slate-50 rounded-[50px] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:scale-110 transition-transform">
                <PoundSterling size={120} />
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">Landlord & Renters Scheme</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                If you live in a rented property or own a rental property, you could be eligible for a grant of up to 75% of the cost of the installation, capped at £350.
              </p>
              <ul className="space-y-4">
                 {[
                   "Grant for flat owners",
                   "Grant for people in rented accommodation",
                   "Grant for landlords (Residential & Commercial)"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                     <CheckCircle2 size={18} className="text-primary" /> {item}
                   </li>
                 ))}
              </ul>
           </div>

           <div className="p-12 bg-slate-900 text-white rounded-[50px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-primary/20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={120} />
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">Workplace Charging Scheme</h3>
              <p className="text-white/60 font-medium mb-8 leading-relaxed">
                Voucher-based scheme that provides support towards the up-front costs of the purchase and installation of EV charge-points, for eligible businesses, charities and public sector organisations.
              </p>
              <ul className="space-y-4">
                 {[
                   "Up to £350 per socket",
                   "Up to 40 sockets across all sites",
                   "Available for businesses and charities"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                     <CheckCircle2 size={18} className="text-primary" /> {item}
                   </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* The Process */}
        <section className="mb-32">
           <div className="text-center mb-16 space-y-4">
             <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em]">We Handle Everything</h2>
             <h3 className="text-4xl md:text-5xl font-black tracking-tight">Zero paperwork for you.</h3>
           </div>
           
           <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Eligibility Check", icon: <Info />, text: "We check if you or your property qualifies for the current grant schemes." },
                { title: "Grant Application", icon: <FileText />, text: "We prepare and submit all the necessary paperwork to OZEV on your behalf." },
                { title: "Instant Discount", icon: <PoundSterling />, text: "We deduct the grant amount immediately from your installation quote." }
              ].map((step, i) => (
                <div key={i} className="space-y-6 text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mx-auto border border-slate-100">
                     {step.icon}
                   </div>
                   <h4 className="text-xl font-bold uppercase italic tracking-tight">{step.title}</h4>
                   <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">{step.text}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Warning/Important Box */}
        <div className="p-10 bg-amber-50 border border-amber-100 rounded-[40px] flex flex-col md:flex-row items-center gap-8 mb-32">
           <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center text-amber-700 shrink-0 shadow-sm">
             <AlertTriangle size={32} />
           </div>
           <div>
              <h4 className="text-lg font-black text-amber-900 uppercase tracking-tight mb-2">Important Scheme Changes</h4>
              <p className="text-amber-800/70 text-sm font-medium leading-relaxed">
                As of April 2022, the OZEV Electric Vehicle Homecharge Scheme (EVHS) is no longer available to homeowners of single-unit properties (bungalows and detached, semi-detached or terraced houses). However, homeowners in flats and those in rental accommodation remain eligible.
              </p>
           </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-[60px] p-12 md:p-20 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Save £350 today.</h2>
          <button 
            onClick={() => setIsGrantWizardOpen(true)}
            className="inline-flex px-12 py-6 bg-white text-primary font-bold rounded-2xl hover:bg-slate-50 hover:scale-[1.02] transition-all text-xl shadow-2xl uppercase tracking-tighter italic"
          >
            Check My Eligibility
          </button>
        </div>
      </div>
    </main>
  );
}
