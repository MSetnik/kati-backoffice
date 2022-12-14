import React, { useEffect, useState } from 'react'
import './App.css'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { addNewCatalogToDb, addNewCategoryToDb, getStoreData } from './endpoints/firestore'
import { Link, redirect, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchStores } from './store/store-slice'
import { addNewCategory, fetchCategories } from './store/category-slice'
import { addNewCatalog, fetchCatalogs } from './store/catalog-slice'
import { fetchAllProducts } from './store/products-slice'

function App () {
  const [datePickerStart, setDatePickerStart] = useState(moment())
  const [datePickerEnd, setDatePickerEnd] = useState(moment())
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [stores, setStores] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')

  // redux
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      dispatch(fetchStores()).then(resp => {
        setStores(resp.payload)
      })
      dispatch(fetchCategories())
      dispatch(fetchCatalogs())
      dispatch(fetchAllProducts())
    }

    getData()
  }, [])

  const addCatalog = async () => {
    if (datePickerStart !== '' && datePickerEnd !== '' && selectedStoreId !== '' && selectedStoreId !== 0) {
      const catalogId = await addNewCatalogToDb({ storeId: selectedStoreId, dateFrom: datePickerStart.toDate(), dateTo: datePickerEnd.toDate() })
      dispatch(addNewCatalog({ id: catalogId, storeId: selectedStoreId, dateFrom: datePickerStart.unix(), dateTo: datePickerEnd.unix() }))
      const params = `catalog_id=${catalogId}&store_id=${selectedStoreId}`
      navigate(`/add-to-catalog/${params}`)
    } else {
      alert('unesite vrijednost u sva polja')
    }
  }

  const addCategory = async () => {
    if (newCategoryName !== '') {
      const categoryId = await addNewCategoryToDb({ categoryName: newCategoryName })
      dispatch(addNewCategory({ id: categoryId, name: newCategoryName }))
    } else {
      alert('unesite naziv nove kategorije')
    }
  }

  return (
    <div className="container main-container">
     <div className="row">
      <div className="col-sm">
        <button data-bs-toggle="modal" data-bs-target="#addCatalogModal" type="button" className="btn btn-primary">Novi katalog</button>
      </div>
      <div className="col-sm">
       <Link to={`/add-to-catalog/catalog_id=${0}&store_id=${0}`}><button type="button" className="btn btn-primary">Dodaj proizvode</button></Link>
      </div>
      <div className="col-sm">
       <button type="button" data-bs-toggle="modal" data-bs-target="#addCategoryModal" className="btn btn-primary">Dodaj kategoriju</button>
      </div>
      <div className="col-sm">
       <Link to={'/edit-catalog'}><button type="button" className="btn btn-primary">Uredi katalog</button></Link>
      </div>
    </div>

     {/* <!-- Modal novi katalog--> */}
      <div className="modal fade" id="addCatalogModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                      <option defaultValue={-1}>Odaberi trgovinu</option>

                      {
                        stores.map((store, index) => (
                          <option key={index} value={store.id}>{store.name}</option>
                        ))
                      }

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
                    <button className="btn btn-primary" data-bs-dismiss="modal" onClick={() => addCatalog()}>Dodaj novi katalog</button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Modal dodaj kategoriju --> */}
      <div className="modal fade" id="addCategoryModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Novi katalog</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="form-row align-items-center">
                  <TextField id="outlined-basic" label="Naziv Kategorije" variant="outlined" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />

                  <div className="col-auto my-1">
                    <button className="btn btn-primary" data-bs-dismiss="modal" onClick={() => addCategory()}>Dodaj novu kategoriju</button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
