import { Dashboard } from "./pages/Dashboard/Dashboard";
import { SignIn } from "./pages/SignIn/SignIn";
import { SignUp } from "./pages/SignUp/SignUp";
import { PageRouteCollection } from "./utils/types/Shared";

export const pageRouteCollection = {
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
    }
    
} satisfies PageRouteCollection;