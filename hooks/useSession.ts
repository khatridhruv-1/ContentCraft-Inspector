import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/user/appwrite';

export const useSession = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        
        if (!sessionToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Try to get user data with the session token
        const userData = await getUser(sessionToken);
        
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // If no user data, clear the invalid session
          localStorage.removeItem('sessionToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // Clear invalid session
        localStorage.removeItem('sessionToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return {
    isLoading,
    isAuthenticated,
    user
  };
}; 