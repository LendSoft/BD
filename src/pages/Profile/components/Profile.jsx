import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthStore from '../../../stores/AuthStore';
import Button from '../../../UI/Button';
import '../../../assets/styles/Profile.css';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profile/${id}`);
        setProfile(response.data);
        setFirstName(response.data.first_name || '');
        setLastName(response.data.last_name || '');
        setPhoneNumber(response.data.phone_number || '');
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setError('Ошибка при загрузке профиля');
      }
    };

    const fetchUserRequests = async () => {
      try {
        const response = await api.get(`/user_requests/${id}`);
        setRequests(response.data);
      } catch (err) {
        console.error('Ошибка загрузки заявок:', err);
        setError('Ошибка при загрузке заявок');
      }
    };

    fetchProfile();
    fetchUserRequests();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    const updateData = {};
    if (firstName !== profile.first_name) updateData.first_name = firstName;
    if (lastName !== profile.last_name) updateData.last_name = lastName;
    if (phoneNumber !== profile.phone_number) updateData.phone_number = phoneNumber;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      setError('Нет данных для обновления');
      return;
    }

    try {
      const response = await api.put(`/profile/${id}`, {
        ...updateData,
        current_user_id: AuthStore.user.id
      });
      setProfile({ ...profile, ...response.data });
      setPassword('');
      setSuccessMessage('Профиль успешно обновлен');
      if (AuthStore.user.id === parseInt(id)) {
        await AuthStore.updateProfile(id, updateData);
      }
      setTimeout(() => setSuccessMessage(''), 3000); // Скрыть сообщение через 3 секунды
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      setError(err.response?.data?.error || 'Ошибка при обновлении профиля');
    }
  };

  if (!profile) {
    return <div>Загрузка...</div>;
  }

  const canEdit = AuthStore.user?.role === 'admin' || AuthStore.user?.id === parseInt(id);

  return (
    <div className="profile">
      <h2>Профиль пользователя</h2>
      <p className="username"><strong>Имя пользователя:</strong> {profile.username}</p>
      <p><strong>Имя:</strong> {profile.first_name || '-'}</p>
      <p><strong>Фамилия:</strong> {profile.last_name || '-'}</p>
      <p><strong>Номер телефона:</strong> {profile.phone_number || '-'}</p>
      {canEdit && (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Фамилия"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Номер телефона"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="password"
            placeholder="Новый пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <Button type="submit">Обновить профиль</Button>
        </form>
      )}
      <div className="requests">
        {requests.length ? (
          requests.map((req) => (
            <div key={req.id} className="request-item">
              <h4>Адрес: {req.addres}</h4>
              <h4>Происшествие: {req.incident}</h4>
              <h4>Приоритет: {req.prioritet}</h4>
              <h4>Заявитель: {req.applicant}</h4>
              <h4>Номер телефона: {req.phone_number}</h4>
              <h4>Статус: {req.status === 'submitted' ? 'Подана' : req.status === 'deleted' ? 'Удалена' : 'Перенаправлена'}</h4>
            </div>
          ))
        ) : (
          <h3>Поданные заявки отсутствуют</h3>
        )}
      </div>
    </div>
  );
};

export default Profile;