import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Router from "./router/Router";
import AuthStore from "./stores/AuthStore";
import { observer } from "mobx-react-lite";
import "./App.css";

const App = observer(() => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthStore.loadFromStorage();
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="wrapper">
      {AuthStore.isAuthenticated && <Navbar />}
      <Router />
    </div>
  );
});

export default App;