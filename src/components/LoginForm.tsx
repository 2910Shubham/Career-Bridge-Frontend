import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  api?: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Please enter your email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Please enter your password';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      const success = await login(formData.email, formData.password);
      setIsSubmitting(false);
      if (success) {
        // Redirect to profile based on user role
        if (user && user.role === 'student') {
          navigate('/student-profile');
        } else if (user && user.role === 'recruiter') {
          navigate('/recruiter-profile');
        } else {
          navigate('/');
        }
      } else {
        setErrors({ api: 'Invalid email or password' });
      }
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
            <Home size={16} />
            <span>Back to Home</span>
          </button>
        </Link>
      </div>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg" style={{ backgroundColor: '#5A827E' }}>
            <LogIn className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#5A827E' }}>Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>
        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#5A827E' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Enter your email"
                  onFocus={(e) => e.target.style.borderColor = '#5A827E'}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? '#fca5a5' : '#e5e7eb'}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#5A827E' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.password ? 'border-red-300 focus:border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Enter your password"
                  onFocus={(e) => e.target.style.borderColor = '#5A827E'}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? '#fca5a5' : '#e5e7eb'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              {errors.api && <p className="text-red-500 text-sm mt-1">{errors.api}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 