import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type VerificationStatus = 'pending' | 'success' | 'error';

const VerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [message, setMessage] = useState<string>('Verifying your account...');
  const hasFetched = useRef<boolean>(false);

  useEffect(() => {
    if (hasFetched.current || !token) return;
    hasFetched.current = true;
    
    const verify = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/verify/${token}`);
        const data = await response.json();
        if (response.ok && data.isVerified) {
          setStatus('success');
          setMessage('Verification Successful! Your account has been verified.');
        } else if (data.isVerified === false) {
          setStatus('error');
          setMessage(data.message || 'Verification failed. Invalid or expired token.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again later.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === 'pending' && (
          <div className="text-blue-600 font-semibold text-lg">{message}</div>
        )}
        {status === 'success' && (
          <>
            <div className="text-green-600 font-bold text-xl mb-2">{message}</div>
            <button
              className="mt-4 px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all text-base"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </>
        )}
        {status === 'error' && (
          <div className="text-red-600 font-bold text-xl mb-2">{message}</div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage; 