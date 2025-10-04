"use client";

import React, { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isExpenses = pathname.includes("expenses");
  const isSettings = pathname.includes("settings");

  const activeClass = "text-blue-600 dark:text-indigo-700 font-bold";
  const inactiveClass = "text-gray-600";

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-gray-900 text-white p-4 shadow fixed top-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between">
          <span className="font-bold text-lg">Peramihin</span>
        </div>
      </header>
      <main
        className="flex-1 container mx-auto p-4 pt-20 pb-24 overflow-auto"
        style={{
          minHeight: 0,
        }}
      >
        {children}
      </main>
      <footer className="bg-gray-100 text-gray-600 fixed bottom-0 w-full z-40">
        <div className="flex justify-around items-center p-4">
          <button
            className={`flex flex-col items-center hover:cursor-pointer hover:text-indigo-400 ${
              isHome ? activeClass : inactiveClass
            }`}
            onClick={() => router.push("/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-sm">Home</span>
          </button>
          <button
            className={`flex flex-col items-center hover:cursor-pointer hover:text-indigo-400 ${
              isExpenses ? activeClass : inactiveClass
            }`}
            onClick={() => router.push("/expenses")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">Expenses</span>
          </button>
          <button
            className={`flex flex-col items-center hover:cursor-pointer hover:text-indigo-400 ${
              isSettings ? activeClass : inactiveClass
            }`}
            onClick={() => router.push("/settings")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
