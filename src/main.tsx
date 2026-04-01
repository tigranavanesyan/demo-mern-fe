import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
const appTree = (
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>{appTree}</GoogleOAuthProvider>
    ) : (
      appTree
    )}
  </StrictMode>
);
