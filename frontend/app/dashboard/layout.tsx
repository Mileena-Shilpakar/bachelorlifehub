import type React from "react";
import { MainNav } from "../components/layout/main-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 container py-6 mt-6 w-[95vw] mx-auto">
        {children}
      </main>
    </div>
  );
}
