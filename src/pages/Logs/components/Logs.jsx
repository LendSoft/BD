import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Button from "../../../UI/Button";
import "../../../assets/styles/Logs.css";
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

const Logs = observer(() => {
  const [searchStr, setSearchStr] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);
  const [routedRequests, setRoutedRequests] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/routed_requests');
        setRoutedRequests(response.data);
      } catch (err) {
        console.error('Ошибка загрузки логов:', err);
        alert('Ошибка при загрузке логов');
      }
    };
    fetchLogs();
  }, []);

  const searchedRequests = routedRequests.filter((req) =>
    [
      req.address,
      req.applicant,
      req.incident,
      req.priority,
      req.phone_number,
      req.service,
    ].some((field) => field.toLowerCase().includes(searchStr.toLowerCase()))
  );

  const limit = 6;
  const countPage = Math.ceil(searchedRequests.length / limit);
  const pages = [];
  for (let i = 1; i <= countPage; i++) {
    pages.push(i);
  }

  return (
    <div className="logs">
      <h2>Логи перенаправленных заявок</h2>
      <input
        value={searchStr}
        placeholder="Поиск по заявкам"
        style={{ margin: "20px auto", border: "3px solid blueviolet", borderRadius: 3, padding: "5px", display: "block" }}
        onChange={(e) => setSearchStr(e.target.value)}
      />
      <div className="pagination">
        {pages.map((page) => (
          <Button
            key={page}
            style={{ margin: "0px 3px" }}
            onClick={() => setSelectedPage(page)}
          >
            {page}
          </Button>
        ))}
      </div>
      <div className="logs-list">
        {searchedRequests.length ? (
          searchedRequests
            .filter(
              (req, i) =>
                i >= selectedPage * limit - limit && i < selectedPage * limit
            )
            .map((req) => (
              <div key={req.id} className="log-item">
                <p>
                  Происшествие: {req.incident} ({req.priority}) по адресу {req.address}. 
                  Заявитель: {req.applicant}, тел.: {req.phone_number}. 
                  Перенаправлено в {req.service} {new Date(req.routed_at).toLocaleString()}.
                </p>
              </div>
            ))
        ) : (
          <h3>Нет перенаправленных заявок</h3>
        )}
      </div>
    </div>
  );
});

export default Logs;