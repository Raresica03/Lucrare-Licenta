import { Admin } from "./pages/Admin/Admin";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Faculties } from "./pages/Faculties/Faculties";
import { Rooms } from "./pages/Rooms/Rooms";
import { SignIn } from "./pages/SignIn/SignIn";
import { SignUp } from "./pages/SignUp/SignUp";
import { PageRouteCollection } from "./utils/types/Shared";

export const pageRouteCollection: PageRouteCollection = {
  dashboard: {
    displayName: "Dashboard",
    path: "/",
    Component: Dashboard,
  },
  signIn: {
    displayName: "SignIn",
    path: "/signin",
    Component: SignIn,
  },
  signUp: {
    displayName: "SignUp",
    path: "/signup",
    Component: SignUp,
  },
  faculties: {
    displayName: "Faculties",
    path: "/faculties",
    Component: Faculties,
  },
  rooms: {
    displayName: "Rooms",
    path: "/rooms",
    Component: Rooms,
  },
  admin: {
    displayName: "Admin",
    path: "/admin",
    Component: Admin,
  },
};
