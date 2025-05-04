import { makeAutoObservable } from "mobx"

class ModalStore{
    showModal = false
    isEditing = false

    constructor(){
        makeAutoObservable(this);
    }
    setShowModal(flag){
        this.showModal = flag
    }
    setIsEditing(flag){
        this.isEditing = flag
    }
}

export default new ModalStore();