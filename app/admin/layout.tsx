"use client";

import { useAdminAuth } from "../context/AdminAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname(); // Add this hook

  useEffect(() => {
    // Only redirect if we're NOT on the login page and not authenticated
    if (!isLoading && !admin && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [admin, isLoading, router, pathname]); // Add pathname to dependencies

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B8501]"></div>
      </div>
    );
  }

  // Don't show admin layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!admin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}

// Admin Navbar Component
const AdminNavbar = () => {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-[#3B8501]">
              OSLGSC Admin
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {admin?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-[#3B8501] hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};