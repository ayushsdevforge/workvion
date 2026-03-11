const FOOTER_PRODUCT = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
];

const FOOTER_SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/ayushsdevforge' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ayush071' },
  { label: 'Twitter / X', href: 'https://x.com/ayushpandey_071' },
  { label: 'Instagram', href: 'https://instagram.com/lucidforu_' },
];

const FooterColumn = ({ title, links, external }) => (
  <div>
    <h4 className="text-sm font-semibold text-white/90 mb-5 uppercase tracking-wider">{title}</h4>
    <ul className="space-y-3">
      {links.map((l) => (
        <li key={l.label}>
          <a href={l.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="text-white/60 hover:text-green-400 transition font-medium">{l.label}</a>
        </li>
      ))}
    </ul>
  </div>
);

const LandingFooter = () => (
  <footer className="relative border-t border-white/10 bg-gradient-to-b from-[#0b0f0c] to-[#050705] text-white">
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid md:grid-cols-12 gap-12">
        {/* Logo + description */}
        <div className="md:col-span-4">
          <div className="cursor-pointer mb-6" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/workvion.png" alt="Workvion" className="h-16 object-contain" />
          </div>
          <p className="text-white/60 max-w-md leading-relaxed text-[15px]">
            Modern employee leave & attendance management platform built for fast-moving teams. Clean UI, powerful dashboard, and smart reports.
          </p>
        </div>

        <div className="hidden md:block md:col-span-2" />
        <div className="md:col-span-3"><FooterColumn title="Product" links={FOOTER_PRODUCT} /></div>
        <div className="md:col-span-3"><FooterColumn title="Connect" links={FOOTER_SOCIAL} external /></div>
      </div>

      <div className="mt-8 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white">© 2026 Workvion. All rights reserved.</p>
        <p className="text-sm text-white/70">
          Made with <span className="text-green-400">♥</span> by <span className="text-white font-semibold">Ayush Kumar</span>
        </p>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
