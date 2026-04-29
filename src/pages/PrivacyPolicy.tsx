import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-40 pb-24 px-6 bg-slate-950 text-white relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <BackButton label="Back to Manchester Hub" />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic"
          >
            Privacy <span className="text-primary italic">Policy.</span>
          </motion.h1>
          <p className="text-xl text-slate-400 mt-6 font-medium">Last Updated: April 25, 2024</p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto prose prose-slate prose-lg">
          <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 mb-12">
            <ShieldCheck size={48} className="text-primary mb-6" />
            <h2 className="text-3xl font-black text-slate-900 mb-6">Your Data & Compliance</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              At Chargeev, we are committed to the security of our Manchester and London network. We handle your personal data (Names, Addresses, Vehicle details) strictly for the purposes of EV technical surveys and installation logistics.
            </p>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mt-12 mb-6 uppercase italic">1. Information We Collect</h3>
          <p className="text-slate-600 font-medium mb-8">
            When you use our "Free Quote" engine, we collect your name, email, property address, and vehicle specifications. This is essential for our engineers to determine electrical compatibility and OZEV grant eligibility.
          </p>

          <h3 className="text-2xl font-black text-slate-900 mt-12 mb-6 uppercase italic">2. Distribution Network Operator (DNO)</h3>
          <p className="text-slate-600 font-medium mb-8">
            As a certified UK installer, we share your address and installation technicals with your regional DNO (e.g., Electricity North West or UKPN) to ensure the local grid can safely support your charger. This is a regulatory requirement.
          </p>

          <h3 className="text-2xl font-black text-slate-900 mt-12 mb-6 uppercase italic">3. Data Retention</h3>
          <p className="text-slate-600 font-medium mb-8">
            Technical installation records are kept for a minimum of 6 years to comply with Building Regulations and Part P certification standards in the UK.
          </p>

          <div className="mt-16 pt-12 border-t border-slate-100">
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">
              Questions regarding GDPR compliance? Contact our Data Protection Lead: compliance@chargeev.uk
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
