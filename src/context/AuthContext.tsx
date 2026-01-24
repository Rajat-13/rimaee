import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  memberSince: string;
  tier: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: Omit<User, 'id' | 'memberSince' | 'tier'>) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("rimae_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("rimae_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("rimae_user");
    }
  }, [user]);

  const login = (userData: Omit<User, 'id' | 'memberSince' | 'tier'>) => {
    const newUser: User = {
      ...userData,
      id: `USR${Date.now()}`,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      tier: "Bronze",
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
