import MapPage from "../pages/Map/components/MapPage";
import Statement from "../pages/Statement/components/Statement";
import Login from "../components/Login";
import Logs from "../pages/Logs/components/Logs";

export const routes = [
  { path: "/statement", element: <Statement />, protected: true },
  { path: "/map", element: <MapPage />, protected: true },
  { path: "/logs", element: <Logs />, protected: true },
  { path: "/login", element: <Login />, protected: false },
  { path: "/register", element: <Login isRegister={true} />, protected: false },
];