import React, { useState } from "react";
import AuthStore from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";

const Login = ({ isRegister = false }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      if (AuthStore.register(username, password)) {
        navigate("/login");
      } else {
        setError("Пользователь уже существует");
      }
    } else {
      if (AuthStore.login(username, password)) {
        navigate("/statement");
      } else {
        setError("Неверный логин или пароль");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
      </form>
      {!isRegister && (
        <p>
          Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
        </p>
      )}
    </div>
  );
};

export default Login;