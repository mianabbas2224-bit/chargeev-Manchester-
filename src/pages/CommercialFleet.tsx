import { motion } from 'motion/react';
import { Database, TrendingUp, Users, Building2, BarChart3, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function CommercialFleet() {
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
              Commercial <br/> <span className="text-primary italic">& Fleet Solutions.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Empower your workforce and electrify your fleet. Robust, scalable charging infrastructure for Manchester\'s businesses and across the UK.
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { 
              title: "Workplace Charging", 
              desc: "Boost employee satisfaction and attract top talent with convenient on-site charging facilities.", 
              icon: <Building2 className="text-primary" /> 
            },
            { 
              title: "Fleet Electrification", 
              desc: "Transition your company vehicles to electric with unified management and billing software.", 
              icon: <Database className="text-primary" /> 
            },
            { 
              title: "Public Access", 
              desc: "Generate additional revenue streams by offering paid public charging at your commercial premises.", 
              icon: <TrendingUp className="text-primary" /> 
            }
          ].map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-slate-50 rounded-[40px] border border-slate-100"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{benefit.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Features/Stats Section */}
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
           <div className="space-y-8">
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em]">Scalable Systems</h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Advanced Load Management & Smart Monitoring.</h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Our commercial solutions don\'t just stop at installation. We provide the intelligence to manage multiple chargers without overloading your local grid.
              </p>
              <div className="space-y-6 pt-4">
                 {[
                   { label: "Real-time Usage Analytics", icon: <BarChart3 size={18} /> },
                   { label: "Remote Fault Diagnostics", icon: <Globe size={18} /> },
                   { label: "Multi-user Access Control", icon: <Users size={18} /> }
                 ].map((feat, i) => (
                   <div key={i} className="flex items-center gap-4 text-slate-900 font-bold">
                     <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                       {feat.icon}
                     </div>
                     {feat.label}
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-slate-900 rounded-[60px] p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-20 h-20 bg-primary/20 rounded-full blur-2xl"></div>
              </div>
              <div className="space-y-12 relative z-10">
                 <div className="space-y-2">
                    <div className="text-primary font-black text-6xl">99.9%</div>
                    <div className="text-white/60 font-bold uppercase tracking-widest text-xs">Uptime Guarantee</div>
                 </div>
                 <div className="h-[1px] bg-white/10 w-full"></div>
                 <div className="space-y-2">
                    <div className="text-white font-black text-6xl">40%</div>
                    <div className="text-white/60 font-bold uppercase tracking-widest text-xs">Reduction in Fuel Costs</div>
                 </div>
                 <div className="h-[1px] bg-white/10 w-full"></div>
                 <div className="space-y-2">
                    <div className="text-white font-black text-6xl">24/7</div>
                    <div className="text-white/60 font-bold uppercase tracking-widest text-xs">Priority Support</div>
                 </div>
              </div>
           </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-[60px] p-12 md:p-20 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Discuss your project?</h2>
          <Link 
            to="/#engine"
            className="inline-flex px-12 py-6 bg-primary text-white font-bold rounded-2xl hover:brightness-110 transition-all text-xl shadow-2xl"
          >
            Request Site Consultation
          </Link>
        </div>
      </div>
    </main>
  );
}
