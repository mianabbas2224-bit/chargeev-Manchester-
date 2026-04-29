import { motion } from 'motion/react';
import { 
  Zap, CheckCircle2, 
  MapPin, Scan, FileText, Wrench, Leaf,
  ArrowRight, ShieldCheck, Database, Sun,
  Calculator, MoveRight, Star, Plus, Minus,
  Camera, HelpCircle, Award, ArrowLeft
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import ManchesterAreas from '../components/ManchesterAreas';
import GrantWizard from '../components/GrantWizard';
import BrandStrip from '../components/BrandStrip';
import { createBooking, BookingData } from '../services/bookingService';

const FAQ_DATA = [
  { 
    q: "Do I need a separate consumer unit for my EV charger?", 
    a: "Not always. If you have a modern consumer unit with a spare 'way' and sufficient capacity, we can install a dedicated circuit. If not, we install a standalone mini-unit specifically for your charger." 
  },
  { 
    q: "How long does a Manchester installation take?", 
    a: "Average install time is 3–4 hours. This includes cable routing, mounting the charger, testing, and a full demonstration of the smart app controls." 
  },
  { 
    q: "What is DNO approval and do I need it?", 
    a: "Yes. Every EV install must be notified to your DNO (Distribution Network Operator). In Manchester, this is Electricity North West. We handle all paperwork and notifications for you." 
  },
  { 
    q: "Can I use an OZEV grant in London?", 
    a: "If you live in a flat or rental property with off-street parking, you can still claim £350 via the OZEV grant. We are a fully authorized OZEV installer for the Greater London area." 
  }
];

const REVIEWS = [
  { name: "David M.", location: "Salford Quays", text: "Incredibly professional service. The engineer explained the PEN fault protection in detail. Highly recommend Chargeev for Manchester installs.", rating: 5 },
  { name: "Sarah L.", location: "Didsbury", text: "Chargeev handled the Landlord consent and OZEV paperwork flawlessly. The Zappi install looks super clean.", rating: 5 },
  { name: "James K.", location: "Stockport", text: "Fastest quote process I've seen. From checking my postcode to installation was exactly 6 days.", rating: 5 },
  { name: "Emma R.", location: "Altrincham", text: "The engineering team in Manchester is top-notch. Clean cable routing and very tidy worker.", rating: 5 },
  { name: "Michael S.", location: "Prestwich", text: "Great communication throughout the DNO approval process. Chargeev makes EV charging simple.", rating: 5 },
  { name: "Sophie T.", location: "Chorlton", text: "Managed to fit my charger in a tricky detached garage. Knowledgeable and local Manchester crew.", rating: 5 },
  { name: "Robert W.", location: "Bury", text: "Transparent pricing from the start. No hidden fees for the extra cable run I needed.", rating: 5 },
  { name: "Chloe J.", location: "Oldham", text: "Best decision to go with a Manchester-based hub. The support is instant and very helpful.", rating: 5 },
  { name: "Liam B.", location: "Bolton", text: "Installed my Ohme ePod in just 3 hours. Handover was thorough, though DNO took an extra day for the paper link.", rating: 4 },
  { name: "Jessica H.", location: "Rochdale", text: "Brilliant local service. App setup took a minute to sync with my older router but the engineer stayed to help.", rating: 4 },
  { name: "Daniel O.", location: "Wigan", text: "High quality hardware. Installation was clean. Cable run was slightly different than planned due to wall depth but the final result is solid.", rating: 3 },
  { name: "Olivia G.", location: "Trafford", text: "Chargeev is reliable. Took a few days to get the final survey slot but once the engineers arrived, the work was perfect.", rating: 3 }
];

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 md:py-8 flex justify-between items-center text-left hover:text-primary transition-colors"
      >
        <span className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-slate-900">{q}</span>
        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pb-8 text-slate-500 font-medium leading-relaxed max-w-2xl"
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

export default function Home() {
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [postcode, setPostcode] = useState('');
  const [mileage, setMileage] = useState(10000);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isGrantWizardOpen, setIsGrantWizardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const reviewCardWidth = windowWidth < 768 ? 312 : 482; // Card width + gap (280+32 or 450+32)
  
  const { register, handleSubmit, reset } = useForm<BookingData>();

  const onSubmit = async (data: BookingData) => {
    setBookingStatus('loading');
    try {
      // 1. Save to Firestore (Native Backend)
      await createBooking(data);
      
      // 2. Alert the Backend API (for Email Notifications)
      await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setBookingStatus('success');
      reset();
      setTimeout(() => setBookingStatus('idle'), 5000);
    } catch (error) {
      setBookingStatus('error');
    }
  };

  const savings = useMemo(() => {
    const petrolCost = mileage * 0.15;
    const evCost = mileage * 0.04;
    return {
      yearly: petrolCost - evCost,
      monthly: (petrolCost - evCost) / 12,
      co2: mileage * 0.2
    };
  }, [mileage]);

  const steps = [
    { title: "Free Survey", desc: "Tell us about your property — we'll spec the right charger.", icon: <Scan className="text-primary" /> },
    { title: "Pick & Book", desc: "Choose your install package and select a slot online.", icon: <FileText className="text-primary" /> },
    { title: "We Install", desc: "Certified engineer fits and commissions in 2–4 hours.", icon: <Wrench className="text-primary" /> },
    { title: "Drive Smarter", desc: "Smart-charge on cheap rates and claim your grant.", icon: <Leaf className="text-primary" /> }
  ];

  const services = [
    { title: "Home Installation", desc: "7kW & 22kW chargers fitted by certified engineers in Manchester.", icon: <Zap />, path: "/home-installation" },
    { title: "Commercial & Fleet", desc: "Car parks, offices and fleet depots — professional UK-wide deployment.", icon: <Database />, path: "/commercial-fleet" },
    { title: "Solar + EV Bundles", desc: "Charge from your own solar with smart load balancing integration.", icon: <Sun />, path: "/solar-ev" },
    { title: "OZEV Grants", desc: "Save up to £350 on your installation — we handle the paperwork.", icon: <ShieldCheck />, path: "/ozev-grants" }
  ];

  return (
    <main>
      <GrantWizard isOpen={isGrantWizardOpen} onClose={() => setIsGrantWizardOpen(false)} />
      {/* Hero Section */}
      <header className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.1] md:leading-[0.95] mb-6 md:mb-8">
                Smart EV <br className="hidden sm:block"/> charging, <span className="text-primary italic">installed right.</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                Premium home and commercial EV chargers, fitted by certified engineers across Manchester and the UK. Free survey, transparent pricing, lifetime support.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <a 
                href="#engine"
                className="px-10 py-5 md:px-12 md:py-6 bg-primary text-slate-950 font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/40 text-lg md:text-xl uppercase tracking-tighter italic"
              >
                Get Free Quote <ArrowRight size={20} />
              </a>
              <button 
                onClick={() => setIsGrantWizardOpen(true)}
                className="px-10 py-5 md:px-12 md:py-6 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 border border-white/10 text-lg md:text-xl uppercase tracking-tighter italic"
              >
                Check Grant Eligibility
              </button>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(0,186,134,0.1),transparent_70%)] pointer-events-none"></div>
      </header>

      <BrandStrip />

      {/* Coverage Map & Network Section */}
      <section className="py-16 md:py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-2 space-y-8 md:space-y-12">
              <div>
                <h2 className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Manchester Network</h2>
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[1] md:leading-[0.9]">
                  Total Coverage <br/> Across <span className="text-primary">MCR.</span>
                </h3>
                <p className="mt-6 md:mt-8 text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                  We operate a decentralized network of certified engineers across Greater Manchester. From Salford to Stockport, we ensure local expertise and rapid response times.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-8 md:p-12 rounded-[40px] relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <MapPin size={14} className="text-primary" /> Check your area
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                      placeholder="Enter Postcode" 
                      className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 font-bold text-slate-900 outline-none focus:border-primary transition-all text-[15px] leading-[23.3333px] min-w-0"
                    />
                    <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary transition-all shrink-0 text-[15px]">
                      Check Coverage
                    </button>
                  </div>
                  {postcode.startsWith('M') ? (
                    <div className="mt-6 flex items-center gap-3 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 size={16} />
                      </div>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest leading-none">
                        Active Node: {postcode} <br/>
                        <span className="text-[10px] opacity-60">Installation available within 6 days</span>
                      </p>
                    </div>
                  ) : postcode.length > 2 && (
                    <p className="mt-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                       Enter your Manchester postcode (e.g. M1)
                    </p>
                  )}
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
              </div>


            </div>

            <div className="lg:col-span-3">
              <ManchesterAreas />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16 md:py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">Everything you need, <br className="hidden sm:block"/> in one place.</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => {
              const Content = (
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="p-10 bg-white rounded-[40px] border border-slate-100 hover:shadow-2xl transition-all group h-full flex flex-col cursor-pointer"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-4">{service.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6 flex-grow">{service.desc}</p>
                  <div className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    {service.title === "OZEV Grants" ? "Check Eligibility" : "Learn More"} <MoveRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              );

              if (service.title === "OZEV Grants") {
                return (
                  <button key={i} onClick={() => setIsGrantWizardOpen(true)} className="text-left">
                    {Content}
                  </button>
                );
              }

              return (
                <Link to={service.path} key={i}>
                  {Content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Savings Section */}
      <section id="savings" className="py-20 md:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-10 md:space-y-12">
              <div className="space-y-6">
                <h2 className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-[0.3em]">Economic Impact</h2>
                <h3 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] md:leading-[0.95]">
                  Save over <span className="text-primary italic">£{Math.floor(savings.yearly / 100) * 100}</span> <br/> 
                  every single year.
                </h3>
                <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                  Switching to electric doesn\'t just save the planet. In Greater Manchester, home charging can reduce your fuel costs by up to 75%.
                </p>
              </div>

              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">Yearly Mileage</label>
                      <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{mileage.toLocaleString()} miles</span>
                    </div>
                    <input 
                      type="range" 
                      min="1000" 
                      max="30000" 
                      step="500" 
                      value={mileage} 
                      onChange={(e) => setMileage(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      style={{ background: `linear-gradient(to right, #00ba86 ${((mileage - 1000) / 29000) * 100}%, #f1f5f9 ${((mileage - 1000) / 29000) * 100}%)` }}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 md:p-8 bg-slate-50 rounded-3xl border border-slate-100">
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Monthly Saving</div>
                       <div className="text-2xl md:text-3xl font-black text-primary tracking-tighter">£{Math.floor(savings.monthly)}</div>
                    </div>
                    <div className="p-6 md:p-8 bg-slate-50 rounded-3xl border border-slate-100">
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">CO2 Offset</div>
                       <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{Math.floor(savings.co2)}kg</div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-900 rounded-[40px] md:rounded-[60px] p-6 sm:p-10 md:p-12 overflow-hidden relative group aspect-square flex flex-col justify-center">
                 <div className="relative z-10 space-y-4 md:space-y-8">
                    <div className="inline-flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-primary/20 backdrop-blur-md rounded-2xl border border-primary/20">
                      <Zap size={12} className="text-primary animate-pulse" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Efficiency Data</span>
                    </div>
                    <h4 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tighter italic leading-[1.1] md:leading-none">
                      Manchester\'s <br/> Green Future, <br/> <span className="text-primary">Secured.</span>
                    </h4>
                    <p className="text-white/40 font-medium text-xs sm:text-sm md:text-lg leading-relaxed max-w-xs md:max-w-sm uppercase tracking-wider">
                      Join thousands of Manchester residents switching to clean, local energy infrastructure.
                    </p>
                 </div>
                 {/* Decorative Grid */}
                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#00ba86_1px,transparent_1px)] bg-[length:24px_24px]"></div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 md:py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20 space-y-4">
            <h2 className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-[0.3em]">The Process</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">From quote to charging <br className="hidden sm:block"/> in under a week.</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="p-8 md:p-10 bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 h-full">
                  <div className="text-3xl md:text-4xl font-black text-black mb-6 md:mb-8">0{i+1}</div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 text-slate-200">
                    <MoveRight size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Accreditations */}
      <section className="py-20 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-3">
               <Award className="text-slate-900" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">NICEIC Approved</span>
             </div>
             <div className="flex items-center gap-3">
               <ShieldCheck className="text-slate-900" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">Part P Registered</span>
             </div>
             <div className="flex items-center gap-3">
               <Zap className="text-slate-900" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">OZEV Authorized</span>
             </div>
             <div className="flex items-center gap-3">
               <CheckCircle2 className="text-slate-900" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">Manchester Hub</span>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Manual Carousel */}
      <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2"></div>
              <div className="max-w-7xl mx-auto px-6 relative z-10 mb-10 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <h2 className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-[0.3em]">Manchester Network Reviews</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mt-4 leading-none">Trusted Across the <br/> North West.</h3>
          </div>
          <div className="flex gap-3 md:gap-4">
            <button 
              onClick={() => setCurrentReviewIndex(prev => Math.max(0, prev - 1))}
              disabled={currentReviewIndex === 0}
              className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl border-2 border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button 
              onClick={() => setCurrentReviewIndex(prev => Math.min(REVIEWS.length - 1, prev + 1))}
              disabled={currentReviewIndex === REVIEWS.length - 1}
              className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl border-2 border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
            >
              <MoveRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <div className="px-6">
          <div className="max-w-7xl mx-auto overflow-visible touch-pan-y">
            <motion.div 
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) {
                  setCurrentReviewIndex(prev => Math.max(0, prev - 1));
                } else if (info.offset.x < -100) {
                  setCurrentReviewIndex(prev => Math.min(REVIEWS.length - 1, prev + 1));
                }
              }}
              animate={{ x: `-${currentReviewIndex * reviewCardWidth}px` }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className="flex gap-8 cursor-grab active:cursor-grabbing"
            >
               {REVIEWS.map((review, i) => (
                <div 
                  key={i}
                  className={`w-[280px] md:w-[450px] flex-shrink-0 space-y-4 md:space-y-6 p-8 md:p-10 bg-white/5 border border-white/10 rounded-[32px] md:rounded-[40px] backdrop-blur-sm transition-all duration-500 ${
                    i === currentReviewIndex ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                  }`}
                >
                  <div className="flex gap-1 text-primary">
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`w-3 h-3 md:w-3.5 md:h-3.5 ${idx < review.rating ? "text-primary" : "text-white/20"}`}
                        fill={idx < review.rating ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <p className="text-base md:text-xl font-black italic tracking-tighter leading-tight text-white/90 min-h-[80px] md:min-h-[100px]">
                    "{review.text}"
                  </p>
                  <div className="pt-4 md:pt-6 border-t border-white/10">
                    <h4 className="text-base md:text-lg font-black italic text-primary">{review.name}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{review.location}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 flex gap-2">
            {REVIEWS.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentReviewIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === currentReviewIndex ? 'w-12 bg-primary' : 'w-4 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-16 lg:gap-24">
          <div className="space-y-8">
            <h2 className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-[0.3em] flex items-center gap-2">
              <HelpCircle size={16} /> Knowledge Base
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[1] md:leading-[0.9]">
              Common <br/> Questions.
            </h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Everything you need to know about EV charging regulations in the UK.
            </p>
            <div className="p-6 md:p-8 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                <FileText size={24} />
              </div>
              <p className="text-[10px] md:text-xs font-bold text-slate-900 uppercase tracking-widest">Guide: DNO Grid Compliance 2024</p>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {FAQ_DATA.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Engine Flow Section */}
      <section id="engine" className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16 space-y-4">
             <h3 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic">Get a Free Quote</h3>
          </div>
          
          <div className="glass-panel p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-2xl relative overflow-hidden">
             {bookingStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 md:py-20"
                >
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <CheckCircle2 className="w-12 h-12 text-primary relative z-10" />
                    <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping opacity-20" />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-6 italic uppercase leading-none">
                    Request <br/> <span className="text-primary">Submitted.</span>
                  </h3>
                  <div className="max-w-sm mx-auto space-y-4">
                    <p className="text-slate-500 font-bold text-lg leading-relaxed uppercase tracking-wider">
                      It is submitted and our team will get back to you soon.
                    </p>
                    <div className="h-[2px] w-12 bg-primary mx-auto" />
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
                      We'll contact you within 24 business hours to finalize your free survey.
                    </p>
                  </div>
                  <button 
                    onClick={() => setBookingStatus('idle')}
                    className="mt-12 text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.4em] border-b border-slate-200 hover:border-primary p-2"
                  >
                    Send another request
                  </button>
                </motion.div>
             ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                        <input {...register('name', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 focus:border-primary outline-none transition-all" placeholder="John Doe" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                        <input {...register('email', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 focus:border-primary outline-none transition-all" placeholder="john@example.com" />
                      </div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Car Make & Model</label>
                        <input {...register('carModel', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 focus:border-primary outline-none transition-all" placeholder="e.g. Tesla Model 3" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Preferred Charger</label>
                        <select {...register('chargerType', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 outline-none focus:border-primary transition-all font-bold">
                           <option value="7kw-standard">7kW Smart Fast Charger</option>
                           <option value="22kw-rapid">22kW Rapid Charger (3-Phase)</option>
                           <option value="solar-integrated">Solar Integrated System</option>
                           <option value="not-sure">Not sure - Help me choose</option>
                        </select>
                      </div>
                   </div>
                   <div className="grid md:grid-cols-3 gap-8">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Charger Location</label>
                        <select {...register('installationLocation', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 outline-none focus:border-primary transition-all font-bold">
                           <option value="front-side">Front/Side House</option>
                           <option value="attached-garage">Attached Garage</option>
                           <option value="detached-garage">Detached Garage</option>
                           <option value="other">Other Location</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Spare Ways</label>
                        <select {...register('spareWays', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 outline-none focus:border-primary transition-all font-bold">
                           <option value="1">1 Spare Way</option>
                           <option value="2-plus">2+ Spare Ways</option>
                           <option value="none">None available</option>
                           <option value="not-sure">Not sure</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Cable Run</label>
                        <select {...register('cableRun', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 outline-none focus:border-primary transition-all font-bold">
                           <option value="up-to-10m">Up to 10 Meters</option>
                           <option value="10-25m">10 - 25 Meters</option>
                           <option value="25-35m">25 - 35 Meters</option>
                           <option value="35m-plus">Over 35 Meters</option>
                        </select>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Installation Address</label>
                      <input {...register('address', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 focus:border-primary outline-none transition-all" placeholder="123 Manchester Road, Manchester" />
                   </div>
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                         <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Preferred Date</label>
                         <input type="date" {...register('preferredDate', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Property Type</label>
                         <select {...register('propertyType', { required: true })} className="w-full px-8 py-5 rounded-2xl bg-white border border-slate-100 outline-none focus:border-primary transition-all font-bold">
                            <option value="home">Home (Residential)</option>
                            <option value="business">Business / Commercial</option>
                         </select>
                      </div>
                   </div>
                   <button type="submit" disabled={bookingStatus === 'loading'} className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-sm rounded-2xl hover:scale-[1.01] transition-all shadow-xl">
                      {bookingStatus === 'loading' ? 'Processing...' : 'Get My Quote'}
                   </button>
                </form>
             )}
          </div>
        </div>
      </section>
    </main>
  );
}
