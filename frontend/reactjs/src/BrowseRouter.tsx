import { createBrowserRouter } from "react-router-dom";
import { pageRouteCollection } from "./Routes";
import { Callback } from "./utils/Callback";
import { PublicRoute } from "./utils/PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/callback",
    element: <Callback />,
  },
  {
    children: Object.values(pageRouteCollection).map((pageRoute) => ({
      path: pageRoute.path,
      element:
        pageRoute.path === "/signin" || pageRoute.path === "/signup" ? (
          <PublicRoute>
            <pageRoute.Component />
          </PublicRoute>
        ) : (
          <pageRoute.Component />
        ),
    })),
  },
]);
