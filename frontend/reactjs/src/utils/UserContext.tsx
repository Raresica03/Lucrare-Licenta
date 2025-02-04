import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  role: string;
  isAuthenticated: boolean;
  firstName: string;
  lastName: string;
}

interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void; 
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");
    return storedUser
      ? {
          ...storedUser,
          isAuthenticated: true,
        }
      : {
          role: "",
          isAuthenticated: false,
          firstName: "",
          lastName: "",
        };
  });

  useEffect(() => {
    if (user.isAuthenticated) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => {
    setUser({
      role: "",
      isAuthenticated: false,
      firstName: "",
      lastName: "",
    });
    sessionStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
