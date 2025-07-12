import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type TabType = 'login' | 'register';

const AuthCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('login');

  return (
    <div className="min-h-screen bg-background">
      {activeTab === 'login' ? (
        <LoginForm />
      ) : (
        <RegisterForm />
      )}
      
      {/* Tab Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-2 flex space-x-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthCard; 