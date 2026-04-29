import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, AlertCircle, Building2, User, Home, Building, ChevronRight, PoundSterling, Landmark } from 'lucide-react';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

type Step = 'user_type' | 'property_type' | 'ownership' | 'result';

interface Result {
  eligible: boolean;
  amount: string;
  scheme: string;
  message: string;
}

export default function GrantWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('user_type');
  const [userType, setUserType] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [result, setResult] = useState<Result | null>(null);

  const handleStart = () => {
    setStep('user_type');
    setResult(null);
  };

  const handleClaim = () => {
    onClose();
    navigate('/#engine');
    // For smooth scrolling if already on home page
    if (window.location.pathname === '/') {
      const element = document.getElementById('engine');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const checkEligibility = (type: string, prop: string) => {
    if (type === 'business') {
      return {
        eligible: true,
        amount: 'Up to £14,000',
        scheme: 'Workplace Charging Scheme (WCS)',
        message: 'Businesses can claim up to £350 per socket for up to 40 sockets across all sites.'
      };
    }
    
    if (type === 'landlord') {
      return {
        eligible: true,
        amount: '£350 per socket',
        scheme: 'EV Chargepoint Grant for Landlords',
        message: 'Landlords can receive up to 200 grants per year for residential properties.'
      };
    }

    if (type === 'resident') {
      if (prop === 'flat' || prop === 'rented') {
        return {
          eligible: true,
          amount: '£350',
          scheme: 'OZEV EV Chargepoint Grant',
          message: 'As a tenant or flat-owner, you qualify for the OZEV grant to reduce installation costs by up to 75%.'
        };
      }
      return {
        eligible: false,
        amount: '£0',
        scheme: 'None Available',
        message: 'Since April 2022, homeowners in single-unit houses generally no longer qualify for OZEV grants, but you can still benefit from 0% VAT on battery storage.'
      };
    }
    
    return null;
  };

  const handleSelection = (value: string) => {
    if (step === 'user_type') {
      setUserType(value);
      if (value === 'business' || value === 'landlord') {
        const res = checkEligibility(value, '');
        setResult(res);
        setStep('result');
      } else {
        setStep('property_type');
      }
    } else if (step === 'property_type') {
      setPropertyType(value);
      const res = checkEligibility(userType, value);
      setResult(res);
      setStep('result');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-[32px] md:rounded-[60px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-400 hover:text-slate-900 transition-colors z-30 bg-white/80 backdrop-blur rounded-full p-1"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>

            {/* Left Bar - Progress */}
            <div className="w-full md:w-56 lg:w-64 bg-slate-50 p-6 md:p-10 flex flex-row md:flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
              <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                  <Landmark size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-sm md:text-xl font-black italic tracking-tighter uppercase leading-none mb-1 md:mb-2">UK Grant <br className="hidden md:block"/> Wizard</h3>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">OZEV Compliance 2024</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 w-24 md:w-full justify-center">
                <div className="flex gap-1">
                  <div className={`h-1 rounded-full transition-all duration-500 flex-1 ${step === 'user_type' ? 'bg-primary' : 'bg-primary/20'}`} />
                  <div className={`h-1 rounded-full transition-all duration-500 flex-1 ${step === 'property_type' ? 'bg-primary' : (step === 'result' ? 'bg-primary' : 'bg-slate-200')}`} />
                  <div className={`h-1 rounded-full transition-all duration-500 flex-1 ${step === 'result' ? 'bg-primary' : 'bg-slate-200'}`} />
                </div>
                <p className="hidden md:block text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-3">Step {step === 'user_type' ? '1' : step === 'property_type' ? '2' : '3'} of 3</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === 'user_type' && (
                  <motion.div 
                    key="user_type"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 md:space-y-8"
                  >
                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase italic">Who is the <br/> installation for?</h4>
                    <div className="grid gap-3 md:gap-4">
                      {[
                        { id: 'resident', title: 'Personal Residence', icon: <User size={18} />, desc: 'For your home or flat' },
                        { id: 'business', title: 'Business / Fleet', icon: <Building2 size={18} />, desc: 'For your workplace' },
                        { id: 'landlord', title: 'Landlord', icon: <Building size={18} />, desc: 'For rental properties' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelection(opt.id)}
                          className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] hover:border-primary hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/20 transition-colors shrink-0">
                            {opt.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm md:text-base text-slate-900 group-hover:text-primary transition-colors">{opt.title}</p>
                            <p className="text-[10px] md:text-xs text-slate-400">{opt.desc}</p>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'property_type' && (
                  <motion.div 
                    key="prop_type"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 md:space-y-8"
                  >
                    <button onClick={() => setStep('user_type')} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary flex items-center gap-2 transition-colors">
                      ← Go Back
                    </button>
                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase italic">What type of <br/> property is it?</h4>
                    <div className="grid gap-3 md:gap-4">
                      {[
                        { id: 'flat', title: 'Flat / Apartment', icon: <Building size={18} />, desc: 'Owned or rented flat' },
                        { id: 'rented', title: 'Rented House', icon: <Home size={18} />, desc: 'Any rented accommodation' },
                        { id: 'owned', title: 'Owned House', icon: <Home size={18} />, desc: 'Private detached/terrace' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelection(opt.id)}
                          className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] hover:border-primary hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/20 transition-colors shrink-0">
                            {opt.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm md:text-base text-slate-900 group-hover:text-primary transition-colors">{opt.title}</p>
                            <p className="text-[10px] md:text-xs text-slate-400">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'result' && result && (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-2 md:py-4"
                  >
                    <button 
                      onClick={() => userType === 'business' || userType === 'landlord' ? setStep('user_type') : setStep('property_type')} 
                      className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary flex items-center gap-2 transition-colors mb-6 mx-auto w-fit"
                    >
                      ← Change Details
                    </button>

                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 ${result.eligible ? 'bg-primary/20 text-primary' : 'bg-amber-100 text-amber-600'}`}>
                      {result.eligible ? <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" /> : <AlertCircle className="w-8 h-8 md:w-10 md:h-10" />}
                    </div>
                    
                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-2 uppercase italic leading-none">
                      {result.eligible ? 'You Are Eligible' : 'Limited Eligibility'}
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 md:mb-8">{result.scheme}</p>
                    
                    {result.eligible && (
                      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-slate-100 mb-6 md:mb-8 inline-block w-full">
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Estimated Saving</p>
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <PoundSterling size={20} className="md:w-6 md:h-6" strokeWidth={3} />
                          <span className="text-4xl md:text-5xl font-black tracking-tighter">{result.amount.replace('£', '')}</span>
                        </div>
                      </div>
                    )}

                    <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed mb-8 md:mb-10 max-w-sm mx-auto">
                      {result.message}
                    </p>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={handleClaim}
                        className="w-full py-4 md:py-5 bg-primary text-slate-950 font-black rounded-xl md:rounded-2xl uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20"
                      >
                        Claim Your Quote
                      </button>
                      <button 
                        onClick={handleStart}
                        className="text-[9px] md:text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.4em] mt-2"
                      >
                        Check Another Property
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
