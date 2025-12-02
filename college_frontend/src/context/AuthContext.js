import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user + token from localStorage on startup
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
      }
    } catch (err) {
      console.error("Failed to load user from localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  // LOGIN FUNCTION (expects { user: {...}, access: "JWT_TOKEN" })
  const login = (data) => {
    if (!data || !data.user || !data.access) {
      console.error("Invalid login data:", data);
      return;
    }

    setUser(data.user);
    setToken(data.access);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.access);
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
