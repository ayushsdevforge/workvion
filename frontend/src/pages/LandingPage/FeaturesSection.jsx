import { motion } from 'framer-motion';
import { HiOutlinePresentationChartLine } from 'react-icons/hi2';
import { AnimatedSection, fadeUp } from '@/components/Motion';
import { FEATURES } from './data';

/* ─── Shared card wrapper ─── */
const FeatureCard = ({ icon: Icon, title, desc, large }) => (
  <motion.div variants={fadeUp}
    className="cursor-pointer group relative p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-brand-100/50
      hover:border-brand-300/60 shadow-sm hover:shadow-xl hover:shadow-brand-200/30 transition-all duration-500"
    style={large ? { padding: '2rem' } : undefined}>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-50/0 to-brand-50/0 group-hover:from-brand-50 group-hover:to-transparent transition-all duration-500" />
    <div className={`relative ${large ? '' : 'flex items-start gap-4'}`}>
      <div className={`${large ? 'h-14 w-14 rounded-2xl mb-5' : 'h-11 w-11 shrink-0 rounded-xl'} bg-brand-800/5 border border-brand-800/10 flex items-center justify-center group-hover:bg-brand-800 group-hover:border-brand-800 transition-all duration-300`}>
        <Icon className={`${large ? 'h-6 w-6' : 'h-5 w-5'} text-brand-800 group-hover:text-white transition-colors duration-300`} />
      </div>
      <div>
        <h3 className={`${large ? 'text-xl' : 'text-base'} font-bold text-brand-950 mb-1`}>{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md">{desc}</p>
      </div>
    </div>
  </motion.div>
);

const FeaturesSection = () => (
  <AnimatedSection id="features" className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center mb-16">
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-brand-800 bg-brand-800/5 px-4 py-1.5 rounded-full border border-brand-800/10 cursor-pointer">
          Features
        </span>
        <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-brand-950 tracking-tight">
          Everything you need
          <span className="relative inline-block ml-2">
            built in
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-700 to-brand-500 rounded-full" />
          </span>
        </h2>
        <p className="mt-5 text-gray-600 max-w-xl mx-auto text-lg">
          Powerful tools designed for modern workplaces. Simple enough for everyone.
        </p>
      </motion.div>

      {/* Row 1 — 1 wide + 2 stacked */}
      <div className="grid md:grid-cols-5 gap-5 mb-5">
        <div className="md:col-span-3">
          <FeatureCard large {...FEATURES[0]} />
        </div>
        <div className="md:col-span-2 flex flex-col gap-5">
          {FEATURES.slice(1, 3).map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>

      {/* Row 2 — 2 stacked + 1 wide */}
      <div className="grid md:grid-cols-5 gap-5">
        <div className="md:col-span-2 flex flex-col gap-5">
          {FEATURES.slice(3, 5).map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
        <div className="md:col-span-3">
          <FeatureCard large icon={HiOutlinePresentationChartLine} {...FEATURES[5]} />
        </div>
      </div>
    </div>
  </AnimatedSection>
);

export default FeaturesSection;
