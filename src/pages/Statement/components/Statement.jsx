import React, { useState, useEffect } from 'react';
import Requests from '../../../modules/Requests/components/Requests';
import RequestForm from '../../../modules/RequestForm/components/RequestForm';
import Modal from '../../../modules/Modal/components/Modal';
import ModalStore from '../../../modules/Modal/store/store';
import { observer } from 'mobx-react-lite';
import Button from '../../../UI/Button';
import '../../../assets/styles/Statement.css';
import axios from 'axios';
import RequestsStore from '../../../modules/Requests/store/store';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

const Statement = observer(() => {
  const [searchStr, setSearchStr] = useState("");

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

  return (
    <div className='statement'>
      <Button onClick={() => ModalStore.setShowModal(true)}>Добавить заявку</Button>
      <input 
        value={searchStr} 
        placeholder='Поиск по заявкам' 
        style={{margin: "0 auto", border: "3px solid blueviolet", borderRadius: 3}}
        onChange={e => setSearchStr(e.target.value)}
      />
      <Requests searchStr={searchStr}/>
      <Modal>
        <RequestForm/>
      </Modal>
    </div>
  );
});

export default Statement;