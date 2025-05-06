import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import AuthStore from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";

const Login = observer(({ isRegister = false }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (isRegister) {
      const success = await AuthStore.register(username, password);
      if (success) {
        navigate("/login");
      } else {
        setError("Пользователь уже существует");
      }
    } else {
      const success = await AuthStore.login(username, password);
      if (success) {
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
});

export default Login;