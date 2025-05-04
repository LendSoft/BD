
import { makeAutoObservable } from "mobx";

class AuthStore {
  user = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
  }

  login(username, password) {
    if (username === "admin" && password === "admin") {
      this.user = { username, role: "admin" };
      this.isAuthenticated = true;
      return true;
    }
    // Simulated user login
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[username] && users[username].password === password) {
      this.user = { username, role: "user" };
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  register(username, password) {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[username]) {
      return false;
    }
    users[username] = { password, role: "user" };
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
  }
}

export default new AuthStore();