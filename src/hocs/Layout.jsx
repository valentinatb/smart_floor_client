import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Sidebar 
        activePath={location.pathname}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <main className={`flex-1 p-4 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {children}
      </main>
    </>
  );
}