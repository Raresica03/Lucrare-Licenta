import { createBrowserRouter } from "react-router-dom";
import { pageRouteCollection } from "./Routes";

export const router = createBrowserRouter([{
    children: Object.values(pageRouteCollection).map((pageRoute) => ({
        path: pageRoute.path,
        Component: pageRoute.Component,
    }))
}])