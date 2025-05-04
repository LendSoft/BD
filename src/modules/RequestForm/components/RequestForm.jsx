import React, { useRef } from 'react'
import { typesAccidents } from '../../../guide/typesAccidents'
import { prioritets } from '../../../guide/prioritets'
import '../../../assets/styles/RequestForm.css'
import { observer } from 'mobx-react-lite'
import RequestFormStore from '../store/store' 
import RequestsStore from '../../Requests/store/store'
import ModalStore from '../../Modal/store/store'
import Button from '../../../UI/Button'
import MapComponent from '../../../components/MapComponent'

const RequestForm = observer(() => {

  const addRequest = () => {
    const newRequest = JSON.parse(JSON.stringify(RequestFormStore))
    
    if(ModalStore.isEditing){
      RequestsStore.updateRequest(newRequest)
      ModalStore.setIsEditing(false)
      ModalStore.setShowModal(false)
      return;
    }
    
    ModalStore.setShowModal(false);
    RequestsStore.addRequest(newRequest);
    RequestFormStore.setEmptyForm();
  }

  const disabled = !(
    RequestFormStore.addres 
    && RequestFormStore.applicant 
    && RequestFormStore.numberPhone 
    && RequestFormStore.coords.length
  )

  return (
    <div className='request-form'>
        <input
          type='text' 
          value={RequestFormStore.addres}
          placeholder='Адрес' 
          onChange={(e) => RequestFormStore.setAddres(e.target.value)}
        />
        <MapComponent/>
        <select onChange={e => RequestFormStore.setTypeAccident(e.target.value)}>
          {
            typesAccidents.map(accident => <option value={accident} key={accident}>{accident}</option>)
          }
        </select>
        <select onChange={e => RequestFormStore.setPrioritet(e.target.value)}>
          {
            prioritets.map(prioritet => <option value={prioritet.name} key={prioritet.number}>{prioritet.number} - {prioritet.name}</option>)
          }
        </select>
        <input 
          value={RequestFormStore.applicant} 
          placeholder='Заявитель'
          onChange={e => RequestFormStore.setApplicant(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder='Номер телефона'
          value={RequestFormStore.numberPhone}
          onChange={e => RequestFormStore.setNumberPhone(e.target.value)}
          />
        <Button 
          disabled={disabled} 
          onClick={addRequest}
          style={disabled ? {opacity: 0.5} : {}}
        >
          {ModalStore.isEditing ? "Редактировать заявку" : "Добавить заявку"}
        </Button>
        <Button 
          onClick={() => {
            RequestsStore.removeRequest(RequestFormStore);
            ModalStore.setIsEditing(false);
            ModalStore.setShowModal(false);
          }}
          style={{ backgroundColor: 'red', marginTop: '10px' }}
        >
          Удалить заявку
        </Button>
    </div>
  )
})

export default RequestForm
