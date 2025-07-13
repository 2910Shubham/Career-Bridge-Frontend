import React, { useState } from 'react';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

interface FormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

interface FormErrors {
  username?: string;
  fullname?: string;
  email?: string;
  password?: string;
  role?: string;
  api?: string;
}

type ResendStatus = 'idle' | 'loading' | 'success' | 'error';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    fullname: '',
    email: '',
    password: '',
    role: 'student', // default role
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle');
  const [resendMessage, setResendMessage] = useState<string>('');

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullname.trim()) newErrors.fullname = 'Please enter your full name';
    if (!formData.username.trim()) newErrors.username = 'Please enter a username';
    if (!formData.email.trim()) newErrors.email = 'Please enter your email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Please enter your password';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.role) newErrors.role = 'Please select a role';
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) {
          setErrors({ api: data.message || 'Registration failed' });
        } else {
          setSuccessMessage('Registered successfully! Please check your email for verification.');
        }
      } catch (error) {
        setErrors({ api: 'Network error. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleResendVerification = async () => {
    if (!formData.email) return;
    setResendStatus('loading');
    setResendMessage('');
    try {
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (response.ok) {
        setResendStatus('success');
        setResendMessage(data.message || 'Verification email resent! Please check your inbox.');
      } else {
        setResendStatus('error');
        setResendMessage(data.message || 'Failed to resend verification email.');
      }
    } catch (error) {
      setResendStatus('error');
      setResendMessage('Network error. Please try again.');
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
        {successMessage && (
          <div>
            <div className="mb-2 p-2 rounded-lg text-green-800 bg-green-100 border border-green-300 text-center font-semibold text-sm">
              {successMessage}
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="mt-1 mb-1 px-3 py-1 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition-all text-xs shadow-sm"
                onClick={handleResendVerification}
                disabled={!formData.email || resendStatus === 'loading'}
              >
                {resendStatus === 'loading' ? 'Resending...' : 'Resend Verification Email'}
              </button>
              {resendMessage && (
                <div className={`mt-1 text-xs ${resendStatus === 'success' ? 'text-green-700' : 'text-red-600'}`}>{resendMessage}</div>
              )}
            </div>
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg" style={{ backgroundColor: '#5A827E' }}>
            <UserOutlined className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#5A827E' }}>Create Account</h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#5A827E' }}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserOutlined className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.fullname}
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.fullname ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-opacity-80'
                  }`}
                  style={{ 
                    focusBorderColor: '#5A827E',
                    '--tw-ring-color': '#5A827E'
                  } as React.CSSProperties}
                  placeholder="Enter your full name"
                  onFocus={(e) => e.target.style.borderColor = '#5A827E'}
                  onBlur={(e) => e.target.style.borderColor = errors.fullname ? '#fca5a5' : '#e5e7eb'}
                />
              </div>
              {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#5A827E' }}>
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserOutlined className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.username ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-opacity-80'
                  }`}
                  style={{ 
                    focusBorderColor: '#5A827E',
                    '--tw-ring-color': '#5A827E'
                  } as React.CSSProperties}
                  placeholder="Enter your username"
                  onFocus={(e) => e.target.style.borderColor = '#5A827E'}
                  onBlur={(e) => e.target.style.borderColor = errors.username ? '#fca5a5' : '#e5e7eb'}
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#5A827E' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailOutlined className="text-gray-400" />
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
                  <LockOutlined className="text-gray-400" />
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
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#5A827E' }}>
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-opacity-80" style={{ 
                  borderColor: formData.role === 'student' ? '#5A827E' : '#e5e7eb',
                  backgroundColor: formData.role === 'student' ? '#f0f9f8' : 'transparent'
                }}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ 
                      borderColor: formData.role === 'student' ? '#5A827E' : '#d1d5db'
                    }}>
                      {formData.role === 'student' && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5A827E' }}></div>
                      )}
                    </div>
                    <span className="text-sm font-medium" style={{ 
                      color: formData.role === 'student' ? '#5A827E' : '#6b7280'
                    }}>Student</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-opacity-80" style={{ 
                  borderColor: formData.role === 'recruiter' ? '#5A827E' : '#e5e7eb',
                  backgroundColor: formData.role === 'recruiter' ? '#f0f9f8' : 'transparent'
                }}>
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={formData.role === 'recruiter'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ 
                      borderColor: formData.role === 'recruiter' ? '#5A827E' : '#d1d5db'
                    }}>
                      {formData.role === 'recruiter' && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5A827E' }}></div>
                      )}
                    </div>
                    <span className="text-sm font-medium" style={{ 
                      color: formData.role === 'recruiter' ? '#5A827E' : '#6b7280'
                    }}>recruiter</span>
                  </div>
                </label>
              </div>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>

            {/* API Error */}
            {errors.api && <p className="text-red-500 text-sm mt-1">{errors.api}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-white text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                backgroundColor: '#5A827E',
                boxShadow: '0 4px 15px rgba(90, 130, 126, 0.3)'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#4a6b67'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#5A827E'}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl font-semibold text-gray-700 text-lg border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            style={{ 
              borderColor: '#84AE92',
              backgroundColor: '#B9D4AA'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = '#5A827E';
              (e.target as HTMLButtonElement).style.backgroundColor = '#a8c99a';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = '#84AE92';
              (e.target as HTMLButtonElement).style.backgroundColor = '#B9D4AA';
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#5A827E' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 