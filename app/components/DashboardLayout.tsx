"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Calendar,
  Search,
  Settings,
  Menu,
  X,
  ChevronRight,
  Bell,
  User,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activity", label: "Activity Feed", icon: Activity },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/search", label: "Search", icon: Search },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link
            href="/"
            className={`flex items-center gap-2 text-blue-600 font-bold text-xl ${
              !sidebarOpen && "hidden"
            }`}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span>Mission Control</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`${!sidebarOpen && "hidden"}`}>{item.label}</span>
                {isActive && sidebarOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className={`${!sidebarOpen && "hidden"}`}>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16">
          <div className="flex items-center justify-between h-full px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              {pathname !== "/" && (
                <>
                  <ChevronRight className="w-4 h-4 mx-2" />
                  <span className="text-gray-900 font-medium capitalize">
                    {pathname.replace("/", "").replace("-", " ") || "Dashboard"}
                  </span>
                </>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {sidebarOpen && <span className="text-sm font-medium">AI Assistant</span>}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}