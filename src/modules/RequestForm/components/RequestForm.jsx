/* Modified src/modules/RequestForm/components/RequestForm.jsx */
import React, { useState, useEffect } from "react";
import "../../../assets/styles/RequestForm.css";
import { observer } from "mobx-react-lite";
import RequestFormStore from "../store/store";
import ModalStore from "../../Modal/store/store";
import AuthStore from "../../../stores/AuthStore";
import Button from "../../../UI/Button";
import MapComponent from "../../../components/MapComponent";
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

const RequestForm = observer(() => {
  const services = ["Полиция", "МЧС", "Больница", "Пожарные", "Соцслужба", "ЖКХ"];
  const [selectedService, setSelectedService] = useState("");
  const [accidentTypes, setAccidentTypes] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typesResponse = await api.get('/accident_types');
        const prioritiesResponse = await api.get('/priorities');
        setAccidentTypes(typesResponse.data);
        setPriorities(prioritiesResponse.data);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        alert('Ошибка при загрузке данных');
      }
    };
    fetchData();
  }, []);

  const saveRequest = async () => {
    const requestData = {
      user_id: AuthStore.user.id,
      address: RequestFormStore.addres,
      latitude: RequestFormStore.coords[0] || 0,
      longitude: RequestFormStore.coords[1] || 0,
      accident_type: RequestFormStore.typeAccident,
      priority: RequestFormStore.prioritet,
      applicant: RequestFormStore.applicant,
      phone_number: RequestFormStore.numberPhone,
    };

    try {
      if (ModalStore.isEditing) {
        await api.put(`/requests/${RequestFormStore.id}`, requestData);
      } else {
        await api.post('/requests', requestData);
      }
      ModalStore.setIsEditing(false);
      ModalStore.setShowModal(false);
      RequestFormStore.setEmptyForm();
    } catch (err) {
      console.error('Ошибка сохранения заявки:', err);
      alert('Ошибка при сохранении заявки');
    }
  };

  const routeRequest = async () => {
    if (selectedService) {
      try {
        await api.post('/routed_requests', {
          request_id: RequestFormStore.id,
          service_name: selectedService,
        });
        ModalStore.setIsEditing(false);
        ModalStore.setShowModal(false);
        RequestFormStore.setEmptyForm();
        setSelectedService("");
      } catch (err) {
        console.error('Ошибка перенаправления заявки:', err);
        alert('Ошибка при перенаправлении заявки');
      }
    }
  };

  const disabled = !(
    RequestFormStore.addres &&
    RequestFormStore.applicant &&
    RequestFormStore.numberPhone &&
    RequestFormStore.coords.length
  );

  return (
    <div className="request-form">
      <input
        type="text"
        value={RequestFormStore.addres}
        placeholder="Адрес"
        onChange={(e) => RequestFormStore.setAddres(e.target.value)}
      />
      <MapComponent />
      <select
        onChange={(e) => RequestFormStore.setTypeAccident(e.target.value)}
        value={RequestFormStore.typeAccident}
      >
        {accidentTypes.map((accident) => (
          <option value={accident} key={accident}>
            {accident}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => RequestFormStore.setPrioritet(e.target.value)}
        value={RequestFormStore.prioritet}
      >
        {priorities.map((prioritet) => (
          <option value={prioritet.name} key={prioritet.number}>
            {prioritet.number} - {prioritet.name}
          </option>
        ))}
      </select>
      <input
        value={RequestFormStore.applicant}
        placeholder="Заявитель"
        onChange={(e) => RequestFormStore.setApplicant(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Номер телефона"
        value={RequestFormStore.numberPhone}
        onChange={(e) => RequestFormStore.setNumberPhone(e.target.value)}
      />
      {AuthStore.user?.role === 'admin' || !ModalStore.isEditing ? (
        <Button
          disabled={disabled}
          onClick={saveRequest}
          style={disabled ? { opacity: 0.5 } : {}}
        >
          {ModalStore.isEditing ? "Сохранить изменения" : "Добавить заявку"}
        </Button>
      ) : null}
      {AuthStore.user?.role === "admin" && ModalStore.isEditing && (
        <>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            style={{ marginTop: "10px" }}
          >
            <option value="">Выберите службу</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <Button
            disabled={!selectedService}
            onClick={routeRequest}
            style={{ marginTop: "10px", ...(selectedService ? {} : { opacity: 0.5 }) }}
          >
            Перенаправить заявку
          </Button>
          <Button
            onClick={async () => {
              try {
                await api.delete(`/requests/${RequestFormStore.id}`);
                ModalStore.setIsEditing(false);
                ModalStore.setShowModal(false);
                RequestFormStore.setEmptyForm();
              } catch (err) {
                console.error('Ошибка удаления заявки:', err);
                alert('Ошибка при удалении заявки');
              }
            }}
            style={{ backgroundColor: "red", marginTop: "10px" }}
          >
            Удалить заявку
          </Button>
        </>
      )}
    </div>
  );
});

export default RequestForm;