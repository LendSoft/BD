import { observer } from 'mobx-react-lite'
import React from 'react'
import ModalStore from '../store/store'
import '../../../assets/styles/Modal.css'

const Modal = observer(({children}) => {
  return (
    <div className={ModalStore.showModal ? 'modal show-modal' : 'modal hide-modal'}>
      <div className={ModalStore.showModal ? 'modal-content show-modal-content' : 'modal-content hide-modal-content'}>
        <h3 className='modal-x' onClick={() => {
          ModalStore.setShowModal(false)
          ModalStore.setIsEditing(false)
        }}>x</h3>
        {children}
      </div>
    </div>
  )
})

export default Modal
