import { createContext, useContext, ReactNode } from 'react';
import { User } from '@prisma/client';
import { useUser } from '@auth0/nextjs-auth0/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null | undefined;
  isAdmin: boolean;
  isAdvocate: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: undefined,
  isAdmin: false,
  isAdvocate: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: auth0User, isLoading, error } = useUser();
  
  // You'll need to fetch the user data from your database here
  // This is just a placeholder for the actual implementation
  const user = auth0User ? {
    id: '',
    auth0Id: auth0User.sub || '',
    email: auth0User.email || '',
    fullName: auth0User.name || '',
    role: 'USER',
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User : null;

  const isAdmin = user?.role === 'ADMIN';
  const isAdvocate = user?.role === 'ADVOCATE';

  return (
    <AuthContext.Provider value={{ user, isLoading, error, isAdmin, isAdvocate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);