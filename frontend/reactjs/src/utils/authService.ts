import { userManager } from "./authConfig";

export const login = () => {
  userManager.signinRedirect();
};

export const logout = () => {
  userManager.signoutRedirect();
};

export const getUser = () => {
  return userManager.getUser();
};

export const signInCallback = () => {
  return userManager.signinRedirectCallback();
};
