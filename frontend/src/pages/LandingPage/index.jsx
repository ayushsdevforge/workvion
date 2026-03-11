import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

import LandingNavbar from './LandingNavbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import LandingFooter from './LandingFooter';

const LandingPage = () => {
  const { login, sendRegisterOtp, verifyRegisterOtp, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const withLoading = async (fn) => {
    setLoading(true);
    try { await fn(); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  const handleLogin = (form) =>
    withLoading(async () => {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    });

  const handleSendRegisterOtp = (form) =>
    withLoading(() => sendRegisterOtp(form.fullName, form.email, form.password));

  const handleVerifyRegisterOtp = (form) =>
    withLoading(async () => {
      const user = await verifyRegisterOtp(form.fullName, form.email, form.password, form.otp);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    });

  const handleForgotPassword = (email) => withLoading(() => forgotPassword(email));

  const handleResetPassword = (email, otp, newPassword) =>
    withLoading(async () => { await resetPassword(email, otp, newPassword); setModal('login'); });

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-brand-50/60 via-white to-brand-50/30">
      <LandingNavbar
        onLogin={() => setModal('login')}
        onRegister={() => setModal('register')}
        scrollTo={scrollTo}
      />

      <HeroSection onRegister={() => setModal('register')} onLogin={() => setModal('login')} />
      <FeaturesSection />
      <HowItWorks />
      <LandingFooter />

      <AuthModal
        modal={modal}
        onClose={() => { setModal(null); setLoading(false); }}
        onLogin={handleLogin}
        onSendRegisterOtp={handleSendRegisterOtp}
        onVerifyRegisterOtp={handleVerifyRegisterOtp}
        onForgotPassword={handleForgotPassword}
        onResetPassword={handleResetPassword}
        loading={loading}
      />
    </div>
  );
};

export default LandingPage;

