import { UserManager } from "oidc-client-ts";

const oidcConfig = {
  authority: "https://your-identity-server-url", // Your Identity Provider URL
  client_id: "your-client-id", // Your client ID
  redirect_uri: "http://localhost:3000/callback", // URL to redirect after login
  post_logout_redirect_uri: "http://localhost:3000",
  response_type: "code", // PKCE flow
  scope: "openid profile", // Scopes required
};

export const userManager = new UserManager(oidcConfig);
