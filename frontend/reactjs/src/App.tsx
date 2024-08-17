import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./BrowseRouter";

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
