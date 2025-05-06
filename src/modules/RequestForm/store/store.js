import { makeAutoObservable } from "mobx";

class RequestFormStore {
  id = null;
  addres = "";
  coords = [];
  incident = "";
  prioritet = "";
  applicant = "";
  numberPhone = "";

  constructor() {
    makeAutoObservable(this);
  }

  setAddres(newAddres) {
    this.addres = newAddres;
  }

  setCoords(newCoords) {
    this.coords = newCoords;
  }

  setIncident(newIncident) {
    this.incident = newIncident;
  }

  setPrioritet(newPrioritet) {
    this.prioritet = newPrioritet;
  }

  setApplicant(newApplicant) {
    this.applicant = newApplicant;
  }

  setNumberPhone(newNumberPhone) {
    this.numberPhone = newNumberPhone;
  }

  setRequest(newRequest) {
    this.id = newRequest.id;
    this.addres = newRequest.addres;
    this.coords = newRequest.coords;
    this.incident = newRequest.incident;
    this.prioritet = newRequest.prioritet;
    this.applicant = newRequest.applicant;
    this.numberPhone = newRequest.numberPhone;
  }

  setEmptyForm() {
    this.id = null;
    this.addres = "";
    this.coords = [];
    this.incident = "";
    this.prioritet = ""; // Исправлено: сбрасываем в пустую строку
    this.applicant = "";
    this.numberPhone = "";
  }
}

export default new RequestFormStore();