import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getProfile();
      const userData = data.data || data.user || data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    const resData = data.data || data;
    localStorage.setItem('token', resData.token);
    localStorage.setItem('user', JSON.stringify(resData.user));
    setToken(resData.token);
    setUser(resData.user);
    toast.success('Logged in successfully');
    return resData.user;
  };

  const sendRegisterOtp = async (fullName, email, password) => {
    await authAPI.sendRegisterOtp({ fullName, email, password });
    toast.success('Verification code sent to your email');
  };

  const verifyRegisterOtp = async (fullName, email, password, otp) => {
    const { data } = await authAPI.verifyRegisterOtp({ fullName, email, password, otp });
    const resData = data.data || data;
    localStorage.setItem('token', resData.token);
    localStorage.setItem('user', JSON.stringify(resData.user));
    setToken(resData.token);
    setUser(resData.user);
    toast.success('Account created successfully');
    return resData.user;
  };

  const forgotPassword = async (email) => {
    await authAPI.forgotPassword({ email });
    toast.success('Reset OTP sent to your email');
  };

  const resetPassword = async (email, otp, newPassword) => {
    await authAPI.resetPassword({ email, otp, newPassword });
    toast.success('Password reset successfully');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, sendRegisterOtp, verifyRegisterOtp, forgotPassword, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
