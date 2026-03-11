import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi2';
import { AnimatedSection, fadeUp } from '@/components/Motion';
import { STEPS } from './data';

const HowItWorks = () => (
  <AnimatedSection id="how-it-works" className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div variants={fadeUp} className="text-center mb-16">
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-brand-800 bg-brand-800/5 px-4 py-1.5 rounded-full border border-brand-800/10 cursor-pointer">
          How it Works
        </span>
        <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-brand-950 tracking-tight">
          Get started in
          <span className="relative inline-block ml-2">
            minutes
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-700 to-brand-500 rounded-full" />
          </span>
        </h2>
        <p className="mt-5 text-gray-600 max-w-xl mx-auto text-lg">
          From onboarding to full workflow in five simple steps.
        </p>
      </motion.div>

      {/* Desktop timeline */}
      <div className="hidden md:block relative">
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-brand-200/50">
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-brand-700 to-brand-800 origin-left" />
        </div>
        <div className="grid grid-cols-5 gap-4 relative">
          {STEPS.map((s) => (
            <motion.div key={s.title} variants={fadeUp} className="cursor-pointer flex flex-col items-center text-center">
              <div className="relative z-10 h-16 w-16 bg-white border-2 border-brand-700 rounded-full flex items-center justify-center shadow-lg shadow-brand-200/40 mb-4">
                <s.icon className="h-6 w-6 text-brand-800" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-800 rounded-full flex items-center justify-center">
                  <HiCheck className="h-3 w-3 text-white" />
                </span>
              </div>
              <h4 className="font-bold text-brand-950 text-sm">{s.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile timeline */}
      <div className="md:hidden space-y-6">
        {STEPS.map((s, i) => (
          <motion.div key={s.title} variants={fadeUp} className="cursor-pointer flex gap-4 items-start">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-brand-50 border-2 border-brand-700 rounded-full flex items-center justify-center shrink-0">
                <s.icon className="h-5 w-5 text-brand-800" />
              </div>
              {i < STEPS.length - 1 && <div className="w-0.5 h-8 bg-brand-300 mt-2" />}
            </div>
            <div className="pt-2">
              <h4 className="font-bold text-brand-950">{s.title}</h4>
              <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </AnimatedSection>
);

export default HowItWorks;
