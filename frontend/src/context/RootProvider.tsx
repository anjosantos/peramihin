"use client";

import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_AWS_COGNITO_AUTHORITY || "",
  client_id: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID || "",
  redirect_uri:
    process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/",
  response_type: "code",
  scope: "email openid phone",
};

const RootProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
};

export default RootProvider;
