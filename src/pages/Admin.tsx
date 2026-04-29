import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getBookings } from '../services/bookingService';
import { motion } from 'motion/react';
import Logo from '../components/Logo';
import { 
  Database, 
  Clock, 
  XCircle, 
  Mail, 
  MapPin,
  Calendar,
  Zap,
  ShieldCheck,
  Plus,
  Trash2,
  Printer,
  FileText,
  ChevronRight,
  ArrowLeft,
  LogIn,
  LogOut
} from 'lucide-react';
import { format } from 'date-fns';
import { auth, signInWithGoogle } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import BackButton from '../components/BackButton';

const ADMIN_EMAILS = ['chargeev.uk@gmail.com'];

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'vault' | 'quote'>('vault');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quote State
  const [quoteData, setQuoteData] = useState({
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    vehicleModel: '',
    vehicleMake: '',
    chargerLocation: '',
    consumerUnitSpares: '',
    cableRun: '',
    chargerName: '',
    chargerType: '',
    quoteNumber: `CH-${Math.floor(1000 + Math.random() * 9000).toString()}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    validUntil: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  });

  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: 'EV Charger Installation (Home)', quantity: 1, price: 850 }
  ]);

  const [isPreview, setIsPreview] = useState(false);
  const [vatRate, setVatRate] = useState(20);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (ADMIN_EMAILS.includes(currentUser.email || '')) {
          loadData();
        } else {
          setError("Access Denied: You do not have admin privileges.");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setBookings([]);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const data = await getBookings();
      setBookings(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load bookings. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogin = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Login Error Details:", err);
      if (err?.code === 'auth/unauthorized-domain') {
        setError("Domain Error: Please add " + window.location.hostname + " to Firebase Authorized Domains.");
      } else {
        setError(err?.message || "Login failed. Please check your browser console for details.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setBookings([]);
      setError(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * (vatRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const handleSendQuote = () => {
    const subject = encodeURIComponent(`Quotation ${quoteData.quoteNumber} from Chargeev`);
    const body = encodeURIComponent(
      `Hello ${quoteData.clientName},\n\nPlease find your quotation for EV Charger Installation below.\n\n` +
      `Quote Number: ${quoteData.quoteNumber}\n` +
      `Total Amount: £${calculateTotal().toLocaleString()}\n\n` +
      `Items:\n` + items.map(i => `- ${i.description}: £${i.price}`).join('\n') +
      `\n\nYou can view/print the full document via the attached PDF or our portal.\n\nBest regards,\nChargeev Manchester`
    );
    window.location.href = `mailto:${quoteData.clientEmail}?subject=${subject}&body=${body}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 px-6 flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 flex shadow-2xl items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-2xl p-12 rounded-[50px] text-center"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-[35px] flex items-center justify-center mx-auto mb-10 border border-primary/20">
            <Logo iconOnly />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Backend <span className="text-primary italic">Access</span></h2>
          <p className="text-slate-400 font-medium mb-12 leading-relaxed text-lg">
            This workspace is restricted. Please authenticate with an authorized Google account.
          </p>
          <div className="space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full py-5 bg-white text-slate-950 font-black rounded-[25px] hover:bg-primary transition-all flex items-center justify-center gap-3 text-xl group"
            >
              <LogIn size={24} className="group-hover:translate-x-1 transition-transform" /> Login Securely
            </button>
            <div className="pt-4">
              <BackButton label="Return to Website" />
            </div>
          </div>
          {error && (
             <p className="mt-8 text-red-500 font-bold text-xs uppercase tracking-widest">{error}</p>
          )}
        </motion.div>
      </main>
    );
  }

  if (!ADMIN_EMAILS.includes(user.email || '')) {
    return (
      <main className="min-h-screen bg-slate-950 flex shadow-2xl items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-2xl p-12 rounded-[50px] text-center"
        >
          <div className="w-24 h-24 bg-red-500/20 rounded-[35px] flex items-center justify-center mx-auto mb-10 border border-red-500/20">
            <XCircle size={48} className="text-red-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Access <span className="text-red-500 italic">Denied</span></h2>
          <p className="text-slate-400 font-medium mb-12 leading-relaxed text-lg">
            Unauthorized: <strong>{user.email}</strong> does not have administrator privileges.
          </p>
          <div className="space-y-4">
            <button 
              onClick={handleLogout}
              className="w-full py-5 bg-white text-slate-950 font-black rounded-[25px] hover:bg-primary transition-all flex items-center justify-center gap-3 text-xl group"
            >
              Switch Account
            </button>
            <div className="pt-4">
              <BackButton label="Return to Website" />
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  // Print View Overlay
  if (isPreview) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] p-8 flex flex-col items-center">
        <div className="flex gap-4 mb-8 print:hidden">
          <button 
            onClick={() => setIsPreview(false)}
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} /> Edit Settings
          </button>
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
          >
            <Printer size={18} /> Download/Print PDF
          </button>
        </div>

        {/* Custom Branded Template matching the sketch */}
        <div className="w-[210mm] min-h-[297mm] bg-white p-[15mm] shadow-2xl rounded-sm print:shadow-none print:m-0 flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="mb-2">
                <Logo />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest pl-1">Manchester Network Hub</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-b-2 border-primary pb-2 mb-2">Quotation</h1>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <p># {quoteData.quoteNumber} | {format(new Date(quoteData.date), 'dd.MM.yyyy')}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">Billed To</p>
            <p className="text-lg font-black text-slate-950 uppercase">{quoteData.clientName}</p>
            <p className="text-xs font-medium text-slate-500 max-w-sm leading-relaxed mt-1">{quoteData.clientAddress}</p>
          </div>

          <div className="overflow-hidden border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#00c853] text-white">
                  <th className="py-3 px-6 text-[11px] font-black uppercase tracking-widest border-r border-white/20">Description</th>
                  <th className="py-3 px-6 text-[11px] font-black uppercase tracking-widest border-r border-white/20">Information</th>
                  <th className="py-3 px-6 text-[11px] font-black uppercase tracking-widest text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {/* Your Vehicle Section */}
                <tr className="bg-[#000080] text-white">
                  <td colSpan={3} className="py-2 px-6 text-[11px] font-black uppercase tracking-[0.4em] text-center italic">Your Vehicle</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-600 bg-slate-50/50">Model</td>
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-900 italic uppercase">{quoteData.vehicleModel}</td>
                  <td className="py-3 px-6 text-right"></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-600 bg-slate-50/50">Vehicle Make</td>
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-900 italic uppercase">{quoteData.vehicleMake}</td>
                  <td className="py-3 px-6 text-right"></td>
                </tr>

                {/* Chose Charger Section */}
                <tr className="bg-[#000080] text-white">
                  <td colSpan={3} className="py-2 px-6 text-[11px] font-black uppercase tracking-[0.4em] text-center italic">Chose Charger</td>
                </tr>
                {items.length > 0 && (
                  <>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-6 text-[11px] font-bold text-slate-900">{items[0]?.description}</td>
                      <td className="py-3 px-6 text-[11px] font-bold text-slate-900"></td>
                      <td className="py-3 px-6 text-right text-[11px] font-bold text-slate-950">£{items[0]?.price.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-6 text-[11px] font-bold text-slate-900">{items[1]?.description || 'Socketed'}</td>
                      <td className="py-3 px-6 text-[11px] font-bold text-slate-900"></td>
                      <td className="py-3 px-6 text-right text-[11px] font-bold text-slate-950">£{items[1]?.price.toFixed(2) || '0.00'}</td>
                    </tr>
                  </>
                )}

                {/* About The Property Section */}
                <tr className="bg-[#000080] text-white">
                  <td colSpan={3} className="py-2 px-6 text-[11px] font-black uppercase tracking-[0.4em] text-center italic">About The Property</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-600 bg-slate-50/50">Charger Location:</td>
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-900 uppercase italic">{quoteData.chargerLocation}</td>
                  <td className="py-3 px-6 text-right"></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-600 bg-slate-50/50">Consumer Unit Spares</td>
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-900 italic"></td>
                  <td className="py-3 px-6 text-right"></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-900">{quoteData.consumerUnitSpares}</td>
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-900 italic"></td>
                  <td className="py-3 px-6 text-right text-[11px] font-bold text-slate-950">£0.00</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-600 bg-slate-50/50">Total Cable Run</td>
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-900"></td>
                  <td className="py-3 px-6 text-right"></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-900">{quoteData.cableRun}</td>
                  <td className="py-3 px-6 text-[11px] font-bold text-slate-900 italic"></td>
                  <td className="py-3 px-6 text-right text-[11px] font-bold text-slate-950">£0.00</td>
                </tr>

                {/* VAT Info Row */}
                <tr className="border-b border-slate-100">
                  <td className="py-4 px-6 text-[10px] font-bold text-slate-600 bg-slate-50/50 uppercase italic tracking-tighter">VAT info</td>
                  <td className="py-4 px-6 text-[10px] font-medium text-slate-500 italic">
                    Please note that all prices in this quote are subject to VAT at standard rate ({vatRate}%).
                  </td>
                  <td className="py-4 px-6 text-right"></td>
                </tr>

                {/* Total Row */}
                <tr className="bg-white">
                  <td colSpan={2} className="py-6 px-6 text-right text-lg font-black uppercase italic tracking-tighter text-slate-900">Total :</td>
                  <td className="py-6 px-6 text-right text-xl font-black text-[#00c853]">£{calculateTotal().toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 p-6 border-2 border-slate-200 rounded-xl bg-slate-50 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
             <p className="text-[10px] font-bold text-slate-600 leading-relaxed text-center italic tracking-tight">
               By accepting this quote you agree with our standard T&C of service. You also agree the provided personal details to be used in relation to the required service. For more info, feel free to check our <span className="text-primary underline">Privacy Policy</span>.
             </p>
          </div>

          <div className="mt-auto pt-8 flex justify-between items-end border-t border-slate-100">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] space-y-1">
              <p>Certified Installation Network</p>
              <p>Manchester Hub HQ</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black italic uppercase tracking-widest text-slate-900">Chargeev Professional</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo iconOnly className="!gap-0" />
            <div className="leading-none text-slate-900">
              <span className="text-lg font-black uppercase tracking-tighter block">Chargeev</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Admin Station</span>
            </div>
          </Link>
          <div className="h-8 w-[1px] bg-slate-100"></div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('vault')}
              className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                activeTab === 'vault' ? 'bg-slate-950 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Database size={14} /> Project Vault
            </button>
            <button 
              onClick={() => setActiveTab('quote')}
              className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                activeTab === 'quote' ? 'bg-slate-950 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'
              }`}
            >
              <FileText size={14} /> Quotation Studio
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 pr-6 border-r border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Authenticated Manager</p>
              <p className="text-sm font-black text-slate-900 leading-none">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            title="Secure Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-16 px-8">
        {activeTab === 'vault' ? (
          <>
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-20">
              <div className="space-y-6">
                <h1 className="text-7xl font-black tracking-tighter text-slate-900 uppercase">
                  Project <span className="text-primary italic">Vault</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                  Real-time monitoring of all installation requests in the Manchester area. Every lead is synced across your local and cloud infrastructure.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 min-w-[200px]">
                  <div className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Total Quote Requests</div>
                  <div className="text-6xl font-black text-slate-900 tracking-tighter">{bookings.length}</div>
                </div>
                <div className="p-8 bg-primary text-white rounded-[40px] shadow-2xl shadow-primary/30 min-w-[200px]">
                  <div className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Active Leads</div>
                  <div className="text-6xl font-black tracking-tighter">
                    {bookings.filter(b => b.status === 'pending').length}
                  </div>
                </div>
              </div>
            </div>

            {error ? (
              <div className="p-16 bg-red-50 border border-red-100 rounded-[60px] text-center">
                <XCircle size={64} className="text-red-500 mx-auto mb-6" />
                <p className="text-red-900 text-xl font-bold">{error}</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-32 bg-white rounded-[80px] border border-slate-100 text-center">
                <Logo iconOnly className="mx-auto mb-8 opacity-20 scale-150" />
                <h3 className="text-3xl font-black text-slate-900 mb-4">Vault is empty</h3>
                <p className="text-slate-400 font-medium text-lg max-w-md mx-auto">Once customers submit quote requests, they will populate here in real-time.</p>
              </div>
            ) : (
              <div className="grid gap-8">
                {bookings.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)).map((booking, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    key={booking.id}
                    className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col lg:flex-row gap-10 items-start lg:items-center relative group"
                  >
                    <div className="flex-1 space-y-8 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center ${
                            booking.propertyType === 'home' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'
                          }`}>
                            <Logo iconOnly className="scale-75" />
                          </div>
                          <div>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tight">{booking.name}</h4>
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-2">
                              <Clock size={14} className="text-primary" /> 
                              {booking.createdAt ? format(booking.createdAt.toDate(), 'MMMM d, yyyy • h:mm a') : 'Synced recently'}
                            </p>
                          </div>
                        </div>
                        <div className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest ${
                          booking.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                          {booking.status}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 pt-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                             <Logo iconOnly className="scale-50 grayscale opacity-50" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Equipment</div>
                            <div className="text-sm font-bold text-slate-700 capitalize">{booking.chargerType?.replace(/-/g, ' ') || 'Standard Install'}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                             <ShieldCheck size={18} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Vehicle</div>
                            <div className="text-sm font-bold text-slate-700">{booking.carModel || 'Not Specified'}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Site & Layout</div>
                            <div className="text-sm font-bold text-slate-700">
                              {booking.installationLocation?.replace(/-/g, ' ')} • {booking.cableRun}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Consumer Unit</div>
                            <div className="text-sm font-bold text-slate-700">{booking.spareWays} Spare Ways</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                            <Mail size={18} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Contact</div>
                            <div className="text-sm font-bold text-slate-700">{booking.email}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Requested Window</div>
                            <div className="text-sm font-bold text-slate-700">
                              {booking.preferredDate ? format(booking.preferredDate.toDate(), 'EEEE, MMMM do') : 'Flexible'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full lg:w-auto">
                      <button 
                        onClick={() => {
                          const [make, ...modelParts] = booking.carModel?.split(' ') || ['', ''];
                          
                          setQuoteData({
                            ...quoteData,
                            clientName: booking.name,
                            clientAddress: booking.address,
                            clientEmail: booking.email,
                            vehicleMake: make || 'Not Specified',
                            vehicleModel: modelParts.join(' ') || 'Standard Model',
                            chargerLocation: booking.installationLocation?.replace(/-/g, ' ') || 'Site Pending',
                            consumerUnitSpares: booking.spareWays || 'Technical assessment required',
                            cableRun: booking.cableRun || 'Standard (<10m)',
                            chargerName: booking.chargerType === '22kw-rapid' ? 'Ohme ePod Smart (22kW)' : 'Ohme ePod Smart (7kW)',
                            chargerType: 'Socketed'
                          });
                          
                          const requestedCharger = booking.chargerType === '22kw-rapid' 
                            ? 'Ohme ePod Smart Rapid (22kW)' 
                            : 'Ohme ePod Smart Fast (7kW)';
                          
                          const price = booking.chargerType === '22kw-rapid' ? 1450 : 849;

                          setItems([
                            { id: '1', description: requestedCharger, quantity: 1, price: price },
                            { id: 'type', description: 'Socketed', quantity: 1, price: 0 }
                          ]);
                          
                          setActiveTab('quote');
                        }}
                        className="px-10 py-5 bg-white border-2 border-slate-900 text-slate-900 text-sm font-black uppercase tracking-widest rounded-3xl hover:bg-slate-50 transition-all text-center"
                      >
                        Create Quote
                      </button>
                      <a 
                        href={`mailto:${booking.email}`}
                        className="px-10 py-5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-3xl hover:bg-primary transition-all text-center"
                      >
                        Email Directly
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-16">
              <div className="space-y-4">
                <h1 className="text-6xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                  Quote <span className="text-primary italic">Studio</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium">Design professional, branded Chargeev quotations.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsPreview(true)}
                  className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-colors"
                >
                  <Printer size={18} /> Print Preview
                </button>
                <button 
                  onClick={handleSendQuote}
                  className="px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-transform flex items-center gap-3"
                >
                  <Mail size={18} /> Send to Client
                </button>
              </div>
            </div>

            <div className="grid gap-12">
              <section className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl shadow-slate-200/20">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div> Client Particulars
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                    <input 
                      type="text" 
                      value={quoteData.clientName}
                      onChange={(e) => setQuoteData({...quoteData, clientName: e.target.value})}
                      placeholder="e.g. John Smith"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                    <input 
                      type="email" 
                      value={quoteData.clientEmail}
                      onChange={(e) => setQuoteData({...quoteData, clientEmail: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Installation Address</label>
                    <textarea 
                      value={quoteData.clientAddress}
                      onChange={(e) => setQuoteData({...quoteData, clientAddress: e.target.value})}
                      placeholder="Street, Town, Postcode"
                      rows={3}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl shadow-slate-200/20">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div> Quote Details
                </h3>
                <div className="grid sm:grid-cols-3 gap-8 mb-12">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Quote Number</label>
                    <input 
                      type="text" 
                      value={quoteData.quoteNumber}
                      onChange={(e) => setQuoteData({...quoteData, quoteNumber: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-center outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Issue Date</label>
                    <input 
                      type="date" 
                      value={quoteData.date}
                      onChange={(e) => setQuoteData({...quoteData, date: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-center outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Expiry Date</label>
                    <input 
                      type="date" 
                      value={quoteData.validUntil}
                      onChange={(e) => setQuoteData({...quoteData, validUntil: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-center outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Description & Items</span>
                    <button 
                      onClick={addItem}
                      className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus size={14} /> Add Line Item
                    </button>
                  </div>

                  {items.map((item) => (
                    <div key={item.id} className="grid md:grid-cols-[1fr,100px,150px,auto] gap-4 items-end animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Service description"
                          className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-2 text-center">
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-sm text-center outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">£</span>
                          <input 
                            type="number" 
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-16 pt-8 border-t border-slate-50 flex justify-end">
                  <div className="w-72 space-y-4">
                    <div className="flex justify-between text-slate-500 font-bold">
                      <span className="text-xs uppercase tracking-widest">Subtotal</span>
                      <span>£{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 font-bold">
                      <span className="text-xs uppercase tracking-widest">Adjust VAT %</span>
                      <input 
                        type="number"
                        value={vatRate}
                        onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                        className="w-20 px-3 py-1 bg-slate-50 border-none rounded-lg text-right font-black text-slate-900 outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex justify-between text-slate-500 font-bold">
                      <span className="text-xs uppercase tracking-widest">VAT Amount</span>
                      <span>£{calculateVAT().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-3xl font-black text-slate-900 pt-4 border-t border-slate-100">
                      <span>Total</span>
                      <span>£{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
