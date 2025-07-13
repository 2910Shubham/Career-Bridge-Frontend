interface User {
  userId: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthResponse {
  message: string;
  data: User;
}

// Get stored user data
export const getStoredUser = (): User | null => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
};

// Get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Get cookies as object
export const getCookies = (): { [key: string]: string } => {
  return document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as { [key: string]: string });
};

// Verify user authentication with backend
export const verifyUserAuth = async (): Promise<User | null> => {
  try {
    const token = getAuthToken();
    const cookies = getCookies();
    
    // Use token from localStorage or cookies
    const authToken = token || cookies.token || cookies.authToken;
    
    if (!authToken) {
      return null;
    }

    const response = await fetch('http://localhost:3000/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
    });

    if (response.ok) {
      const data: AuthResponse = await response.json();
      return data.data;
    } else {
      // If verification fails, clear stored data
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      return null;
    }
  } catch (error) {
    console.error('Error verifying user authentication:', error);
    return null;
  }
};

// Store user data and token
export const storeUserData = (userData: User, token?: string): void => {
  localStorage.setItem('user', JSON.stringify(userData));
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

// Clear user data and token
export const clearUserData = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await verifyUserAuth();
  return user !== null;
};

// Get user role
export const getUserRole = (): string | null => {
  const user = getStoredUser();
  return user?.role || null;
}; 