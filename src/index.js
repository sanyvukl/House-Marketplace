import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/user/user.context";
import { CategoriesProvider } from "./context/category/category.context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CategoriesProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </CategoriesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
