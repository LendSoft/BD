import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../../assets/styles/Contacts.css';

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get("/contacts");
        setContacts(response.data);
      } catch (err) {
        console.error("Ошибка загрузки контактов:", err);
        alert("Ошибка при загрузке контактов");
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className="contacts">
      <h2>Контакты</h2>
      <p>Если ваше происшествие не подходит под категории в форме заявки или требует срочного реагирования, свяжитесь с соответствующими службами:</p>
      <table>
        <thead>
          <tr>
            <th>Служба</th>
            <th>Телефон</th>
            <th>Адрес</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={index}>
              <td>{contact.service || "Единый центр"}</td>
              <td>{contact.phone_number}</td>
              <td>{contact.address || "-"}</td>
              <td>{contact.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Contacts;