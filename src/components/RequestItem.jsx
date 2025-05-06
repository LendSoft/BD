import React from 'react';
import '../assets/styles/RequestItem.css';
import ModalStore from '../modules/Modal/store/store';
import RequestFormStore from '../modules/RequestForm/store/store';
import AuthStore from '../stores/AuthStore';

const RequestItem = ({ request }) => {
  const handleClick = () => {
    if (AuthStore.user?.role === 'admin') {
      ModalStore.setShowModal(true);
      ModalStore.setIsEditing(true);
      RequestFormStore.setRequest({
        id: request.id,
        addres: request.addres,
        coords: request.coords,
        incident: request.incident,
        prioritet: request.prioritet,
        applicant: request.applicant,
        numberPhone: request.phone_number,
      });
    }
  };

  return (
    <div
      className="request-item"
      onClick={handleClick}
      style={AuthStore.user?.role === 'admin' ? { cursor: 'pointer' } : { cursor: 'default' }}
    >
      <h3>Адрес: {request.addres}</h3>
      <h3>Происшествие: {request.incident}</h3>
      <h3>Приоритет: {request.prioritet}</h3>
      <h3>Заявитель: {request.applicant}</h3>
      <h3>Номер телефона заявителя: {request.phone_number}</h3>
    </div>
  );
};

export default RequestItem;