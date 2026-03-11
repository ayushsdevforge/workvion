import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import { fadeUp, stagger } from '@/components/Motion';
import Marquee from './Marquee';
import { HERO_STATS, HERO_LEAVES } from './data';

const SimpleButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  const base = 'cursor-pointer relative px-7 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2';
  const styles = variant === 'primary'
    ? 'bg-brand-800 text-white hover:bg-brand-700 shadow-md shadow-brand-900/20'
    : 'bg-white text-brand-800 border border-brand-800 hover:bg-brand-50';
  return <button onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>;
};

const HeroSection = ({ onRegister, onLogin }) => (
  <section className="relative pt-38 pb-0 px-6 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-brand-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-6xl mx-auto relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* Left — copy */}
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}
            className="relative inline-flex items-center gap-2 px-5 py-2 bg-brand-800/5 text-brand-800 text-xs font-semibold mb-8 tracking-wide uppercase cursor-pointer border border-brand-800/10 rounded-sm">
            <span className="h-1.5 w-1.5 bg-brand-700 rounded-full animate-pulse" />
            Employee Management Platform
          </motion.div>

          <motion.h1 variants={fadeUp}
            className="text-5xl lg:text-6xl font-extrabold text-brand-950 leading-[1.08] tracking-tight">
            Manage Your Team
            <span className="relative inline-block ml-3">
              Smarter
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8 C50 2, 150 2, 198 8" stroke="url(#underline-grad)" strokeWidth="4" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#15803d" /><stop offset="1" stopColor="#166534" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
            Streamline leave requests, track attendance, and manage your workforce — all from one
            <span className="font-semibold text-brand-800"> beautiful dashboard</span>.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <SimpleButton onClick={onRegister}>Get Started Free <HiArrowRight className="h-4 w-4" /></SimpleButton>
            <SimpleButton variant="secondary" onClick={onLogin}>Login</SimpleButton>
          </motion.div>
        </motion.div>

        {/* Right — dashboard illustration */}
        <DashboardPreview />
      </div>

      <div className="mt-14 pb-6"><Marquee /></div>
    </div>
  </section>
);

/* ─── Mini dashboard preview (right side) ─── */
const DashboardPreview = () => (
  <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
    className="relative hidden lg:block">
    <div className="absolute -inset-6 bg-gradient-to-r from-brand-300/20 via-brand-200/10 to-brand-400/20 rounded-3xl blur-3xl" />
    <div className="relative bg-white/80 backdrop-blur-sm border border-brand-100/60 rounded-2xl shadow-2xl shadow-brand-900/10 overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 mx-8">
          <div className="h-5 bg-gray-200/70 rounded-md max-w-[200px] mx-auto" />
        </div>
      </div>

      <div className="p-5 space-y-3">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {HERO_STATS.map(([l, v, bg, txt, brd]) => (
            <div key={l} className={`p-3 rounded-xl ${bg} border ${brd}`}>
              <p className="text-[10px] text-gray-500 font-medium">{l}</p>
              <p className={`text-xl font-bold ${txt} mt-0.5`}>{v}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
          <div className="flex items-end gap-1.5 h-20">
            {[40, 65, 55, 80, 70, 90, 75, 85, 60, 95, 88, 72].map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.05 }}
                className="flex-1 bg-gradient-to-t from-brand-700 to-brand-500 rounded-t" />
            ))}
          </div>
        </div>

        {/* Leave rows */}
        <div className="space-y-1.5">
          {HERO_LEAVES.map(([t, s, cls]) => (
            <div key={t} className="flex items-center justify-between py-1.5 px-3 bg-gray-50/80 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-700 font-medium">{t}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cls}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default HeroSection;
