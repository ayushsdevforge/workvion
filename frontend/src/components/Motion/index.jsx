import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── Reusable animation variants ─── */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const slideRight = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Animated wrapper — triggers once when visible ─── */
export const AnimatedSection = ({ children, className = '', id, variants = stagger, as = 'section', ...props }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Tag = motion[as] || motion.section;

  return (
    <Tag ref={ref} id={id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={variants} className={className} {...props}>
      {children}
    </Tag>
  );
};

/* ─── Single animated element ─── */
export const FadeUp = ({ children, className = '', delay = 0, ...props }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay } } }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/* ─── Page wrapper — fades in the whole page ─── */
export const PageTransition = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);
