import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthStore from "../stores/AuthStore";
import "../assets/styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthStore.logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <ul className="navbar-list">
        {AuthStore.isAuthenticated && (
          <>
            <li className="navbar-list__item">
              <NavLink className="navbar-list__item-link" to="/statement">
                Журнал
              </NavLink>
            </li>
            <li className="navbar-list__item">
              <NavLink className="navbar-list__item-link" to="/map">
                Карта
              </NavLink>
            </li>
            <li className="navbar-list__item">
              <NavLink className="navbar-list__item-link" to="/contacts">
                Контакты
              </NavLink>
            </li>
            {AuthStore.user?.role === "admin" && (
              <li className="navbar-list__item">
                <NavLink className="navbar-list__item-link" to="/logs">
                  Логи
                </NavLink>
              </li>
            )}
            <li className="navbar-list__item">
              <NavLink
                className="navbar-list__item-link navbar-list__item-logout"
                to="/login"
                onClick={handleLogout}
              >
                <img src="/logout.png" alt="Выйти" className="logout-icon" />
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;