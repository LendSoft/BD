import React from 'react'
import '../assets/styles/RequestItem.css'
import ModalStore from '../modules/Modal/store/store'
import RequestFormStore from '../modules/RequestForm/store/store'

const RequestItem = ({request}) => {
  return (
    <div 
      className='request-item' 
      onClick={() => {
        ModalStore.setShowModal(true)
        ModalStore.setIsEditing(true)
        RequestFormStore.setRequest(request)
      }}
    >
      <h3>Адрес: {request.addres}</h3>
      <h3>Тип аварии: {request.typeAccident}</h3>
      <h3>Приоритет: {request.prioritet}</h3>
      <h3>Заявитель: {request.applicant}</h3>
      <h3>Номер телефона заявителя: {request.numberPhone}</h3>
    </div>
  )
}

export default RequestItem
