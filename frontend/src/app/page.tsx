"use client";

import { useEffect } from "react";

import { useAuth } from "react-oidc-context";
import { getExpenses } from "@/api";

export default function Home() {
  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const expenses = await getExpenses();
      console.log(expenses);
    };
    fetchData();
  }, []);

  const signOutRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID || "";
    const logoutUri = "<logout uri>";
    const cognitoDomain = process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN || "";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <a
          href="#"
          onClick={async (e) => {
            e.preventDefault();
            try {
              await navigator.clipboard.writeText(auth.user?.access_token || '');
              alert('Access token copied to clipboard!');
            } catch (err) {
              console.error('Failed to copy: ', err);
              alert('Failed to copy to clipboard');
            }
          }}
        >
          {" "}
          Access Token: {auth.user?.access_token}{" "}
        </a>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}
