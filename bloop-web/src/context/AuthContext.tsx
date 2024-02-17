"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AccessTokenPayload } from "bloop-utils/types";
import { useAuthCheck } from "@/hooks/api/auth/useAuthCheck";
import { useLogout } from "@/hooks/api/auth/useLogout";
import { refreshAccessToken } from "@/lib/httpClient";

interface AuthContextProps {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: AccessTokenPayload | null;
  refreshUser: () => Promise<void>;
  login: (accessToken: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<AccessTokenPayload | null>(null);

  const authCheck = useAuthCheck();
  const logoutMutation = useLogout();

  const login = (accessToken: string) => {
    setIsLoggedIn(true);
    localStorage.setItem("access_token", accessToken);

    const payload = jwtDecode<AccessTokenPayload>(accessToken);
    setUser(payload);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setUser(null);
  };

  const refreshUser = async () => {
    await refreshAccessToken();
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    const payload = jwtDecode<AccessTokenPayload>(accessToken);
    setUser(payload);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    authCheck
      .mutateAsync()
      .then(() => {
        const payload = jwtDecode<AccessTokenPayload>(accessToken);

        setUser(payload);
        setIsLoggedIn(true);
      })
      .catch(async () => {
        await logout();
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        user,
        refreshUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
