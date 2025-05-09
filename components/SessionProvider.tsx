'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from '@/hooks/useSession';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface SessionContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
}

const SessionContext = createContext<SessionContextType>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
});

export const useSessionContext = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, user } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // List of public routes that don't require authentication
      const publicRoutes = ['/auth/login', '/auth/signup'];
      
      if (!isAuthenticated && !publicRoutes.includes(pathname)) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push('/auth/login');
      } else if (isAuthenticated && publicRoutes.includes(pathname)) {
        // Redirect to home if authenticated and trying to access auth pages
        router.push('/home');
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  return (
    <SessionContext.Provider value={{ isLoading, isAuthenticated, user }}>
      {children}
    </SessionContext.Provider>
  );
} 