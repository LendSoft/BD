import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import AuthStore from "../stores/AuthStore";
import { observer } from "mobx-react-lite";

const ProtectedRoute = ({ children }) => {
  return AuthStore.isAuthenticated ? children : <Navigate to="/login" />;
};

const Router = observer(() => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthStore.loadFromStorage();
    console.log('Router useEffect:', { isAuthenticated: AuthStore.isAuthenticated, user: AuthStore.user });
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

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
        <Route
          path="/"
          element={
            AuthStore.isAuthenticated ? (
              <Navigate to="/statement" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
});

export default Router;