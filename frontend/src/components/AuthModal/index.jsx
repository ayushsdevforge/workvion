import { useState, useEffect } from 'react';
import { HiXMark, HiArrowLeft } from 'react-icons/hi2';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';

const VIEWS = { LOGIN: 'login', REGISTER: 'register', REGISTER_OTP: 'register-otp', FORGOT: 'forgot', FORGOT_OTP: 'forgot-otp' };

const AuthModal = ({ modal, onClose, onLogin, onSendRegisterOtp, onVerifyRegisterOtp, onForgotPassword, onResetPassword, loading }) => {
  const [view, setView] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ fullName: '', email: '', password: '', otp: '' });
  const [resetForm, setResetForm] = useState({ email: '', otp: '', newPassword: '' });

  useEffect(() => { if (modal) setView(modal === 'register' ? VIEWS.REGISTER : VIEWS.LOGIN); }, [modal]);

  if (!modal) return null;

  const update = (setter) => (field) => (e) => setter((prev) => ({ ...prev, [field]: e.target.value }));

  const titles = {
    [VIEWS.LOGIN]: ['Welcome back', 'Sign in to continue to your dashboard'],
    [VIEWS.REGISTER]: ['Create an account', 'Get started with Workvion for free'],
    [VIEWS.REGISTER_OTP]: ['Verify your email', `Enter the code sent to ${registerForm.email}`],
    [VIEWS.FORGOT]: ['Forgot password?', 'Enter your email to receive a reset code'],
    [VIEWS.FORGOT_OTP]: ['Reset password', `Enter the code sent to ${resetForm.email}`],
  };

  const [title, subtitle] = titles[view] || titles[VIEWS.LOGIN];
  const showBack = [VIEWS.FORGOT, VIEWS.FORGOT_OTP, VIEWS.REGISTER_OTP].includes(view);

  const handleBack = () => {
    if (view === VIEWS.FORGOT) setView(VIEWS.LOGIN);
    else if (view === VIEWS.FORGOT_OTP) setView(VIEWS.FORGOT);
    else if (view === VIEWS.REGISTER_OTP) setView(VIEWS.REGISTER);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative px-6 pt-6 pb-4">
          {showBack && (
            <button onClick={handleBack} className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-gray-100">
              <HiArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100">
            <HiXMark className="h-5 w-5 text-gray-400" />
          </button>
          <div className="mb-4">
            <img src="/workvion.png" alt="Workvion" className="h-14 object-contain" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>

        <div className="px-6 pb-6">
          {view === VIEWS.LOGIN && (
            <LoginForm form={loginForm} update={update(setLoginForm)} loading={loading}
              onSubmit={() => onLogin(loginForm)} onForgot={() => setView(VIEWS.FORGOT)}
              onRegister={() => setView(VIEWS.REGISTER)} />
          )}
          {view === VIEWS.REGISTER && (
            <RegisterForm form={registerForm} update={update(setRegisterForm)} loading={loading}
              onSubmit={async () => { await onSendRegisterOtp(registerForm); setRegisterForm((p) => ({ ...p, otp: '' })); setView(VIEWS.REGISTER_OTP); }}
              onLogin={() => setView(VIEWS.LOGIN)} />
          )}
          {view === VIEWS.REGISTER_OTP && (
            <RegisterOtpForm form={registerForm} update={update(setRegisterForm)} loading={loading}
              onSubmit={() => onVerifyRegisterOtp(registerForm)}
              onResend={async () => { await onSendRegisterOtp(registerForm); setRegisterForm((p) => ({ ...p, otp: '' })); }} />
          )}
          {view === VIEWS.FORGOT && (
            <ForgotForm form={resetForm} update={update(setResetForm)} loading={loading}
              onSubmit={async () => { await onForgotPassword(resetForm.email); setResetForm((p) => ({ ...p, otp: '', newPassword: '' })); setView(VIEWS.FORGOT_OTP); }}
              onBack={() => setView(VIEWS.LOGIN)} />
          )}
          {view === VIEWS.FORGOT_OTP && (
            <ResetForm form={resetForm} update={update(setResetForm)} loading={loading}
              onSubmit={() => onResetPassword(resetForm.email, resetForm.otp, resetForm.newPassword)}
              onResend={async () => { await onForgotPassword(resetForm.email); setResetForm((p) => ({ ...p, otp: '' })); }} />
          )}
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ form, update, loading, onSubmit, onForgot, onRegister }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
    <FormInput label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
    <FormInput label="Password" type="password" placeholder="••••••••" value={form.password} onChange={update('password')} required />
    <div className="flex justify-end">
      <button type="button" onClick={onForgot} className="text-sm text-brand-600 font-medium hover:text-brand-700">Forgot password?</button>
    </div>
    <Button type="submit" loading={loading} className="w-full">Sign in</Button>
    <p className="text-center text-sm text-gray-500">
      Don't have an account?{' '}
      <button type="button" onClick={onRegister} className="text-brand-600 font-medium hover:text-brand-700">Create one</button>
    </p>
  </form>
);

const RegisterForm = ({ form, update, loading, onSubmit, onLogin }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
    <FormInput label="Full Name" placeholder="John Doe" value={form.fullName} onChange={update('fullName')} required />
    <FormInput label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
    <FormInput label="Password" type="password" placeholder="Min 6 characters" value={form.password} onChange={update('password')} required minLength={6} />
    <Button type="submit" loading={loading} className="w-full">Send verification code</Button>
    <p className="text-center text-sm text-gray-500">
      Already have an account?{' '}
      <button type="button" onClick={onLogin} className="text-brand-600 font-medium hover:text-brand-700">Sign in</button>
    </p>
  </form>
);

const RegisterOtpForm = ({ form, update, loading, onSubmit, onResend }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
    <FormInput label="Verification Code" placeholder="Enter 6-digit code" value={form.otp} onChange={update('otp')} required maxLength={6} />
    <Button type="submit" loading={loading} className="w-full">Create account</Button>
    <p className="text-center text-sm text-gray-500">
      Didn't receive the code?{' '}
      <button type="button" onClick={onResend} className="text-brand-600 font-medium hover:text-brand-700">Resend</button>
    </p>
  </form>
);

const ForgotForm = ({ form, update, loading, onSubmit, onBack }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
    <FormInput label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
    <Button type="submit" loading={loading} className="w-full">Send reset code</Button>
    <p className="text-center text-sm text-gray-500">
      Remember your password?{' '}
      <button type="button" onClick={onBack} className="text-brand-600 font-medium hover:text-brand-700">Back to login</button>
    </p>
  </form>
);

const ResetForm = ({ form, update, loading, onSubmit, onResend }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
    <FormInput label="Verification Code" placeholder="Enter 6-digit code" value={form.otp} onChange={update('otp')} required maxLength={6} />
    <FormInput label="New Password" type="password" placeholder="Min 6 characters" value={form.newPassword} onChange={update('newPassword')} required minLength={6} />
    <Button type="submit" loading={loading} className="w-full">Reset password</Button>
    <p className="text-center text-sm text-gray-500">
      Didn't receive the code?{' '}
      <button type="button" onClick={onResend} className="text-brand-600 font-medium hover:text-brand-700">Resend</button>
    </p>
  </form>
);

export default AuthModal;
