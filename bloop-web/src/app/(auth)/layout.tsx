"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const auth = useAuth();

  if (auth.isLoading) return <div>loading..</div>;

  if (auth.isLoggedIn) return redirect("/");

  return <>{children}</>;
};

export default AuthLayout;
