import React, { useState } from "react";
import { typesAccidents } from "../../../guide/typesAccidents";
import { prioritets } from "../../../guide/prioritets";
import "../../../assets/styles/RequestForm.css";
import { observer } from "mobx-react-lite";
import RequestFormStore from "../store/store";
import RequestsStore from "../../Requests/store/store";
import ModalStore from "../../Modal/store/store";
import AuthStore from "../../../stores/AuthStore";
import Button from "../../../UI/Button";
import MapComponent from "../../../components/MapComponent";

const RequestForm = observer(() => {
  const services = ["Полиция", "МЧС", "Больница"];
  const [selectedService, setSelectedService] = useState("");

  const saveRequest = () => {
    const updatedRequest = JSON.parse(JSON.stringify(RequestFormStore));

    if (ModalStore.isEditing) {
      RequestsStore.updateRequest(updatedRequest);
    } else {
      RequestsStore.addRequest(updatedRequest);
    }

    ModalStore.setIsEditing(false);
    ModalStore.setShowModal(false);
    RequestFormStore.setEmptyForm();
  };

  const routeRequest = () => {
    if (selectedService) {
      const request = JSON.parse(JSON.stringify(RequestFormStore));
      RequestsStore.routeRequest(request, selectedService);
      ModalStore.setIsEditing(false);
      ModalStore.setShowModal(false);
      RequestFormStore.setEmptyForm();
      setSelectedService("");
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
        {typesAccidents.map((accident) => (
          <option value={accident} key={accident}>
            {accident}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => RequestFormStore.setPrioritet(e.target.value)}
        value={RequestFormStore.prioritet}
      >
        {prioritets.map((prioritet) => (
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
            onClick={() => {
              RequestsStore.removeRequest(RequestFormStore);
              ModalStore.setIsEditing(false);
              ModalStore.setShowModal(false);
              RequestFormStore.setEmptyForm();
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