import React, { useEffect, useState } from 'react'
import './App.css'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { addNewCatalog, getStoreData } from './endpoints/firestore'

function App () {
  const [datePickerStart, setDatePickerStart] = useState(moment())
  const [datePickerEnd, setDatePickerEnd] = useState(moment())
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [stores, setStores] = useState([])

  useEffect(() => {
    const getStores = async () => {
      setStores(await getStoreData())
    }

    getStores()
  }, [])

  const addCatalog = () => {
    if (datePickerStart !== '' && datePickerEnd !== '' && selectedStoreId !== '' && selectedStoreId !== 0) {
      addNewCatalog({ storeId: selectedStoreId, dateFrom: datePickerStart, dateTo: datePickerEnd })
    } else {
      alert('unesite vrijednost u sva polja')
    }
  }

  return (
    <div className="container main-container">
     <div className="row">
      <div className="col-sm">
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" className="btn btn-primary">Novi katalog</button>
      </div>
      <div className="col-sm">
       <button type="button" className="btn btn-primary">Primary</button>
      </div>
      <div className="col-sm">
       <button type="button" className="btn btn-primary">Primary</button>
      </div>
      <div className="col-sm">
       <button type="button" className="btn btn-primary">Primary</button>
      </div>
    </div>

     {/* <!-- Modal --> */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Novi katalog</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="form-row align-items-center">
                  <div className="col-auto my-1">
                    <select className="custom-select mr-sm-2" id="inlineFormCustomSelect" onChange={(e) => setSelectedStoreId(e.target.value)}>
                      <option defaultValue={0}>Odaberi trgovinu</option>
                      <option value={'test'}>Odaberi trgovinu</option>

                      {/* {
                        stores.map((store, index) => (
                          <option key={index} value={store.id}>{store.name}</option>
                        ))
                      } */}

                    </select>
                  </div>

                  <div className='col-auto my-1'>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Datum pocetka kataloga"
                        value={datePickerStart}
                        toolbarTitle="Odaberite datum pocetka kataloga"
                        onChange={(newValue) => {
                          setDatePickerStart(newValue)
                        }}
                        inputFormat='DD.MM.YYYY'
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>

                  <div className='col-auto my-1'>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Datum zavrsetka kataloga"
                        value={datePickerEnd}
                        toolbarTitle="Odaberite datum pocetka kataloga"
                        onChange={(newValue) => {
                          setDatePickerEnd(newValue)
                        }}
                        inputFormat='DD.MM.YYYY'
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-auto my-1">
                    <button className="btn btn-primary" onClick={() => addCatalog()}>Dodaj novi katalog</button>
                  </div>
                </div>
            </div>
            {/* <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
