import React, { useMemo, useState } from 'react'
import RequestItem from '../../../components/RequestItem'
import RequestsStore from '../store/store'
import {observer} from 'mobx-react-lite'
import '../../../assets/styles/Requests.css'
import Button from '../../../UI/Button'

const Requests = observer(({searchStr}) => {

  const searchedRequests = useMemo(() => {
    if(searchStr.length){
      return RequestsStore.requests.filter(req => (
        req.addres.includes(searchStr) 
        || req.applicant.includes(searchStr) 
        || req.typeAccident.includes(searchStr)
        || req.prioritet.includes(searchStr)
        || req.numberPhone.includes(searchStr)
      ))
    }else return RequestsStore.requests
  }, [searchStr, RequestsStore.requests])

  const [selectedPage, setSelectedPage] = useState(1);

  const limit = 6;
  const countPage = Math.ceil(searchedRequests.length / limit);
  const pages = [];
  for(let i = 1; i <= countPage; i++){
    pages.push(i);
  }

  return (
    <>
      <div className='pagination'>
        {
          pages.map(page => <Button key={page} style={{margin: "0px 3px"}} onClick={() => setSelectedPage(page)}>{page}</Button>)
        }
      </div>
      <div className='requests'>
          {   
              searchedRequests.length
              ? searchedRequests.filter((req, i) => i >= (selectedPage * limit - limit) && i < (selectedPage * limit)).map(req => <RequestItem key={req.id} request={req}/>)
              : <h3>Заявки не найдены</h3>
          }
      </div>
    </>
  )
})

export default Requests
