
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuth = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="relative min-h-screen flex flex-col">
      {!isAuth && <Header />}
      <main className="flex-grow container mx-auto px-4 py-4">{children}</main>
      <Footer />
    </div>
  );
}
