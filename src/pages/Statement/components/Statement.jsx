import React, { useState } from 'react'
import Requests from '../../../modules/Requests/components/Requests'
import RequestForm from '../../../modules/RequestForm/components/RequestForm'
import Modal from '../../../modules/Modal/components/Modal'
import ModalStore from '../../../modules/Modal/store/store'
import { observer } from 'mobx-react-lite'
import Button from '../../../UI/Button'
import '../../../assets/styles/Statement.css'

const Statement = observer(() => {
  const [searchStr, setSearchStr] = useState("");
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
  )
})

export default Statement
