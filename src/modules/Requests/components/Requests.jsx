import React, { useMemo, useState, useEffect } from 'react';
import RequestItem from '../../../components/RequestItem';
import '../../../assets/styles/Requests.css';
import Button from '../../../UI/Button';
import axios from 'axios';
import RequestsStore from '../store/store';
import { observer } from 'mobx-react-lite';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

const Requests = observer(({ searchStr }) => {
  const [selectedPage, setSelectedPage] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests');
        RequestsStore.setRequests(response.data);
      } catch (err) {
        console.error('Ошибка загрузки заявок:', err);
        alert('Ошибка при загрузке заявок');
      }
    };
    fetchRequests();
  }, []);

  const searchedRequests = useMemo(() => {
    if (searchStr.length) {
      return RequestsStore.requests.filter(req => (
        req.addres.toLowerCase().includes(searchStr.toLowerCase()) ||
        req.applicant.toLowerCase().includes(searchStr.toLowerCase()) ||
        req.incident.toLowerCase().includes(searchStr.toLowerCase()) ||
        req.prioritet.toLowerCase().includes(searchStr.toLowerCase()) ||
        req.phone_number.toLowerCase().includes(searchStr.toLowerCase())
      ));
    }
    return RequestsStore.requests;
  }, [searchStr, RequestsStore.requests]);

  const limit = 6;
  const countPage = Math.ceil(searchedRequests.length / limit);
  const pages = [];
  for (let i = 1; i <= countPage; i++) {
    pages.push(i);
  }

  return (
    <>
      <div className='pagination'>
        {pages.map(page => (
          <Button key={page} style={{ margin: "0px 3px" }} onClick={() => setSelectedPage(page)}>
            {page}
          </Button>
        ))}
      </div>
      <div className='requests'>
        {searchedRequests.length ? (
          searchedRequests
            .filter((req, i) => i >= (selectedPage * limit - limit) && i < (selectedPage * limit))
            .map(req => <RequestItem key={req.id} request={req} />)
        ) : (
          <h3>Заявки не найдены</h3>
        )}
      </div>
    </>
  );
});

export default Requests;