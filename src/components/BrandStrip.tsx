import { motion } from 'motion/react';

const BRANDS = [
  { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" },
  { name: "Ohme", logo: "https://www.ohme-ev.com/wp-content/uploads/2021/10/ohme-logo-pink.svg" },
  { name: "Zappi", logo: "https://myenergi.com/wp-content/uploads/2021/05/myenergi-logo.svg" },
  { name: "Wallbox", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Wallbox_Logo.svg/1200px-Wallbox_Logo.svg.png" },
  { name: "Pod Point", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Pod_Point_Logo.svg/1200px-Pod_Point_Logo.svg.png" }
];

export default function BrandStrip() {
  return (
    <div className="py-12 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center mb-10">Premium Brands We Install</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {BRANDS.map((brand) => (
            <motion.div 
              key={brand.name}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="h-6 md:h-8 w-24 md:w-32 flex items-center justify-center p-2"
            >
              {/* Fallback to text if logos fail, but styled to look like logos */}
              <span className="text-sm font-black tracking-tighter uppercase italic text-slate-900">{brand.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
