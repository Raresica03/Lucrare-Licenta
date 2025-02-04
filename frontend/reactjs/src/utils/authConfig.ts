import { UserManager } from "oidc-client-ts";

const oidcConfig = {
  authority: "https://your-identity-server-url",
  client_id: "your-client-id",
  redirect_uri: "http://localhost:3000/callback",
  post_logout_redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid profile",
};

export const userManager = new UserManager(oidcConfig);
