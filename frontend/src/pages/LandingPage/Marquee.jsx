import { useScroll, useTransform, motion } from 'framer-motion';
import { MARQUEE_ITEMS } from './data';

const Marquee = () => {
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 1000], [0, -600]);
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="overflow-hidden py-5 border-t border-b border-brand-800/30">
      <motion.div style={{ x }} className="flex gap-10 w-max items-center">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 whitespace-nowrap select-none">
            <item.icon className="h-4 w-4 text-brand-800" />
            <span className="text-sm font-semibold text-brand-900 tracking-wide">{item.label}</span>
            <span className="text-brand-700 text-xs">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
