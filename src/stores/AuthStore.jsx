import { makeAutoObservable } from "mobx";
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

class AuthStore {
  user = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  saveToStorage() {
    try {
      localStorage.setItem('auth', JSON.stringify({
        user: this.user,
        isAuthenticated: this.isAuthenticated,
      }));
      console.log('Состояние авторизации сохранено в localStorage:', {
        user: this.user,
        isAuthenticated: this.isAuthenticated,
      });
    } catch (err) {
      console.error('Ошибка сохранения в localStorage:', err.message);
    }
  }

  loadFromStorage() {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const { user, isAuthenticated } = JSON.parse(authData);
        if (user && isAuthenticated) {
          this.user = user;
          this.isAuthenticated = isAuthenticated;
          console.log('Состояние авторизации восстановлено из localStorage:', {
            user,
            isAuthenticated,
          });
        } else {
          console.log('Данные в localStorage некорректны:', authData);
          this.user = null;
          this.isAuthenticated = false;
        }
      } else {
        console.log('Данные авторизации в localStorage отсутствуют');
      }
    } catch (err) {
      console.error('Ошибка загрузки из localStorage:', err.message);
      this.user = null;
      this.isAuthenticated = false;
    }
  }

  async login(username, password) {
    try {
      console.log('Попытка авторизации:', { username });
      const response = await api.post('/login', { username, password });
      console.log('Ответ сервера при авторизации:', response.data);
      this.user = response.data;
      this.isAuthenticated = true;
      this.saveToStorage();
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      console.error('Ошибка авторизации:', errorMessage);
      return false;
    }
  }

  async register(username, password, first_name, last_name, phone_number) {
    try {
      console.log('Попытка регистрации:', { username });
      const response = await api.post('/register', { username, password, first_name, last_name, phone_number });
      console.log('Ответ сервера при регистрации:', response.data);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      console.error('Ошибка регистрации:', errorMessage);
      return false;
    }
  }

  async updateProfile(id, profileData) {
    try {
      const response = await api.put(`/profile/${id}`, profileData);
      this.user = { ...this.user, ...response.data };
      this.saveToStorage();
      return true;
    } catch (err) {
      console.error('Ошибка обновления профиля:', err.message);
      return false;
    }
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem('auth');
    console.log('Пользователь вышел из системы');
  }
}

export default new AuthStore();