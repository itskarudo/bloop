"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { PropsWithChildren, useState } from "react";

interface Props {
  sidebar: React.ReactNode;
}

const AuthLayoutWrapper: React.FC<PropsWithChildren<Props>> = ({
  children,
  sidebar,
}) => {
  const auth = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (auth.isLoading) return <div>loading..</div>;

  if (!auth.isLoggedIn) return redirect("/login");

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen"
      style={{ overflow: "visible" }}
    >
      <ResizablePanel
        collapsible
        collapsedSize={4}
        defaultSize={15}
        minSize={15}
        maxSize={20}
        onCollapse={() => setCollapsed(true)}
        onExpand={() => setCollapsed(false)}
        data-collapsed={collapsed}
        className="group relative z-10 dark:bg-card"
        style={{ overflow: "visible" }}
      >
        {sidebar}
      </ResizablePanel>
      <ResizableHandle className="z-10" />
      <ResizablePanel style={{ overflow: "visible" }}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AuthLayoutWrapper;
