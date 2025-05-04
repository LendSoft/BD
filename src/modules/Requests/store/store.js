import { makeAutoObservable } from "mobx"
import { nanoid } from "nanoid"

class RequestsStore{
    requests = []

    constructor(){
        makeAutoObservable(this)
    }

    addRequest(newRequest){
        newRequest.id = nanoid()
        this.requests.push(newRequest)
    }
    removeRequest(request){
        this.requests = this.requests.filter(req => req.id != request.id)
    }
    updateRequest(request){
        this.requests = this.requests.map(req => {
            if(req.id == request.id) return request;
            return req;
        }) 
    }
}

export default new RequestsStore();