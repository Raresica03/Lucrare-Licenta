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
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    role: "",
    isAuthenticated: false,
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (storedUser && storedUser.role) {
      setUser({
        role: storedUser.role,
        isAuthenticated: true,
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
