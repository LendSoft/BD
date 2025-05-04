import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import AuthStore from "../stores/AuthStore";

const ProtectedRoute = ({ children }) => {
  return AuthStore.isAuthenticated ? children : <Navigate to="/login" />;
};

const Router = () => {
  return (
    <div className="main">
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.protected ? (
                <ProtectedRoute>{route.element}</ProtectedRoute>
              ) : (
                route.element
              )
            }
          />
        ))}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default Router;