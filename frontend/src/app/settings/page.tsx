"use client";

import { useAuth } from "react-oidc-context";

export default function SettingsPage() {
  const auth = useAuth();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
        <p className="text-lg text-gray-700 mb-6">
          <span className="">Hello</span>{" "}
          <span className="font-bold text-indigo-700">
            {auth.user?.profile.email}!
          </span>
        </p>
        <button
          className="px-6 py-2 mb-4 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors font-semibold"
          onClick={async e => {
            e.preventDefault();
            try {
              await navigator.clipboard.writeText(
                auth.user?.access_token || ""
              );
              alert("Access token copied to clipboard!");
            } catch (err) {
              console.error("Failed to copy: ", err);
              alert("Failed to copy to clipboard");
            }
          }}
        >
          Copy Access Token
        </button>
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors font-semibold"
          onClick={() => {
            auth.removeUser();
            window.location.href = `/`;
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
