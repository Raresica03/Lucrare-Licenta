import { createBrowserRouter } from "react-router-dom";
import { pageRouteCollection } from "./Routes";
import { Callback } from "./utils/Callback"; // Import your Callback component

export const router = createBrowserRouter([
  {
    path: "/callback",
    element: <Callback />,
  },
  {
    children: Object.values(pageRouteCollection).map((pageRoute) => ({
      path: pageRoute.path,
      Component: pageRoute.Component,
    }))
  }
]);
