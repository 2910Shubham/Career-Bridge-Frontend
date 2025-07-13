import { useEffect, useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyUserAuth, getStoredUser } from '@/lib/auth';

interface User {
  userId: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to verify with backend
        const verifiedUser = await verifyUserAuth();
        if (verifiedUser) {
          setUser(verifiedUser);
        } else {
          // Fallback to stored user data
          const storedUser = getStoredUser();
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // Fallback to stored user data
        const storedUser = getStoredUser();
        setUser(storedUser);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if no user is found
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, redirect to appropriate profile based on role
  if (user.role === 'student') {
    return <Navigate to="/student-profile" replace />;
  } else if (user.role === 'recruiter') {
    return <Navigate to="/recruiter-profile" replace />;
  }

  // If role is not recognized, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute; 