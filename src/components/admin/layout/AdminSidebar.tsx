"use client";

import { clsx, type ClassValue } from "clsx";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronDown,
  Menu,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Content",
    icon: FileText,
    children: [
      { title: "News & Stories", href: "/admin/news" },
      { title: "Programs", href: "/admin/programs" },
    ],
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    title: "Users & Volunteers",
    href: "/admin/volunteers",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isRouteActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!isCollapsed && (
          <span className="text-xl font-semibold tracking-tight text-gray-900 overflow-hidden whitespace-nowrap">
            Udbhav Admin
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 custom-scrollbar">
        {navItems.map((item) => {
          const hasActiveChild =
            item.children && item.children.some((child) => isRouteActive(child.href));
          const isActive = item.href ? isRouteActive(item.href) : hasActiveChild;
          const isOpen = openDropdowns[item.title] || hasActiveChild;

          return (
            <div key={item.title}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0",
                      isCollapsed ? "mr-0" : "mr-3",
                      isActive ? "text-indigo-700" : "text-gray-400 group-hover:text-gray-500"
                    )}
                    size={20}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (isCollapsed) setIsCollapsed(false);
                      toggleDropdown(item.title);
                    }}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={cn(
                          "flex-shrink-0",
                          isCollapsed ? "mr-0" : "mr-3",
                          isActive ? "text-indigo-700" : "text-gray-400 group-hover:text-gray-500"
                        )}
                        size={20}
                      />
                      {!isCollapsed && <span>{item.title}</span>}
                    </div>
                    {!isCollapsed && item.children && (
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform duration-200 text-gray-400",
                          isOpen ? "rotate-180" : ""
                        )}
                      />
                    )}
                  </button>
                  {!isCollapsed && item.children && isOpen && (
                    <div className="mt-1 space-y-1 pl-10 overflow-hidden">
                      {item.children.map((child) => {
                        const isChildActive = isRouteActive(child.href);
                        return (
                          <Link
                            key={child.title}
                            href={child.href}
                            className={cn(
                              "block rounded-md py-2 pl-3 pr-2 text-sm font-medium transition-colors",
                              isChildActive
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            {child.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>
      
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-500">
            <span>Search</span>
            <kbd className="hidden rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500 sm:inline-block">
              Ctrl+K
            </kbd>
          </div>
        </div>
      )}
    </aside>
  );
}
