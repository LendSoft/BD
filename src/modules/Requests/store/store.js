import { makeAutoObservable } from "mobx";
import { nanoid } from "nanoid";

class RequestsStore {
  requests = [];
  routedRequests = [];

  constructor() {
    makeAutoObservable(this);
  }

  addRequest(newRequest) {
    newRequest.id = nanoid();
    this.requests.push(newRequest);
  }

  removeRequest(request) {
    this.requests = this.requests.filter((req) => req.id !== request.id);
  }

  updateRequest(request) {
    this.requests = this.requests.map((req) => {
      if (req.id === request.id) return request;
      return req;
    });
  }

  routeRequest(request, service) {
    this.removeRequest(request);
    this.routedRequests.push({
      ...request,
      service,
      routedAt: new Date().toISOString(),
    });
  }
}

export default new RequestsStore();