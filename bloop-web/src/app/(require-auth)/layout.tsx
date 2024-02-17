import Sidebar from "@/components/misc/Sidebar";
import AuthLayoutWrapper from "@/components/misc/AuthLayoutWrapper";

const RequireAuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLayoutWrapper sidebar={<Sidebar />}>{children}</AuthLayoutWrapper>
  );
};

export default RequireAuthLayout;
