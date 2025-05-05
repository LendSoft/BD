import { makeAutoObservable } from "mobx";
import { prioritets } from "../../../guide/prioritets";

class RequestFormStore {
  id = null;
  addres = "";
  coords = [];
  typeAccident = "";
  prioritet = prioritets[0].name;
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

  setTypeAccident(newTypeAccident) {
    this.typeAccident = newTypeAccident;
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
    this.typeAccident = newRequest.typeAccident;
    this.prioritet = newRequest.prioritet;
    this.applicant = newRequest.applicant;
    this.numberPhone = newRequest.numberPhone;
  }

  setEmptyForm() {
    this.id = null;
    this.addres = "";
    this.coords = [];
    this.typeAccident = "";
    this.prioritet = prioritets[0].name;
    this.applicant = "";
    this.numberPhone = "";
  }
}

export default new RequestFormStore();