import { MenuItem, Select } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeProductFromDB } from '../../endpoints/firestore'
import { getCatalogDate, getCategoryName, getStoreName } from '../../helpers'
import { fetchCatalogs } from '../../store/catalog-slice'
import { fetchCategories } from '../../store/category-slice'
import { fetchAllProducts, removeProduct } from '../../store/products-slice'
import { fetchStores } from '../../store/store-slice'
import './index.css'

const EditCatalog = () => {
  const { products } = useSelector(state => state.products)
  const { categories } = useSelector(state => state.categories)
  const { catalog } = useSelector(state => state.catalogs)
  const { stores } = useSelector(state => state.stores)

  const dispatch = useDispatch()
  const [selectedCatalogId, setSelectedCatalogId] = useState('1')

  const deleteProduct = async (productId) => {
    if (confirm('Obrisat cete odabrani proizvod. Sljedeća radnja se ne može poništiti. Želite li nastaviti?')) {
      await removeProductFromDB(productId)
      dispatch(removeProduct(productId))
      console.log('Thing was saved to the database.')
    } else {
      // Do nothing!
    }
  }

  const refetchData = async () => {
    dispatch(fetchStores())
    dispatch(fetchCategories())
    dispatch(fetchCatalogs())
    dispatch(fetchAllProducts())
  }

  return (
    <div className='container container-edit-catalog'>
        <div className="select-btn-div">
            <Select
            value={selectedCatalogId}
            label="Odaberi kategoriju"
            onChange={(e) => setSelectedCatalogId(e.target.value)}
            >
                <MenuItem key={-1} value={'1'}>Prikazi sve proizvode</MenuItem>
                {catalog.filter(c => c.dateFrom <= moment().unix() && moment().unix() <= c.dateTo).map((catalog, index) => {
                  return <MenuItem key={index} value={catalog.id}>{`${getStoreName(catalog.storeId, stores)} od ${moment.unix(catalog.dateFrom).format('DD.MM.')} do ${moment.unix(catalog.dateTo).format('DD.MM.')}`}</MenuItem>
                })}
            </Select>
            <button type="button" className="btn btn-primary" onClick={() => refetchData()}>Ucitaj podatke</button>
        </div>
        <table className="table">
            <thead>
                <tr className='table-active'>
                    <th scope="col">#</th>
                    <th scope="col">Naziv</th>
                    <th scope="col">Opis</th>
                    <th scope="col">Kategorija</th>
                    <th scope="col">Puna cijena</th>
                    <th scope="col">Snizena cijena</th>
                    <th scope="col">Slika</th>
                    <th scope="col">Katalog</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>

            {
                selectedCatalogId === '1'
                  ? products.filter(p => p.startAt <= moment().unix() && moment().unix() <= p.endAt).map((p, i) => {
                    return (
                        <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>{getCategoryName(p.categoryId, categories)}</td>
                            <td>{p.fullPrice} kn</td>
                            <td>{p.discountedPrice} kn</td>
                            <td><a href={p.imgUrl} target="_blank" rel="noreferrer">{p.name} slika</a></td>
                            <td>{`${getStoreName(p.storeId, stores)} od ${moment(getCatalogDate(p.catalogId, catalog).dateFrom).format('DD.MM.')} do ${moment(getCatalogDate(p.catalogId, catalog).dateTo).format('DD.MM.')}`}</td>
                            <td><button type="button" className="btn btn-danger" onClick={() => deleteProduct(p.id)}>Obriši proizvod</button></td>
                        </tr>
                    )
                  })
                // moment().unix() - (86400 * 5) = danas - 5 dana (86400s = 1 dan)
                  : products.filter(p => moment().unix() <= p.endAt && p.catalogId === selectedCatalogId).map((p, i) => {
                    return (
                    <tr key={i}>
                        <th scope="row">{i + 1}</th>
                        <td>{p.name}</td>
                        <td>{p.description}</td>
                        <td>{getCategoryName(p.categoryId, categories)}</td>
                        <td>{p.fullPrice} kn</td>
                        <td>{p.discountedPrice} kn</td>
                        <td><a href={p.imgUrl} target="_blank" rel="noreferrer">{p.name} slika</a></td>
                        <td>{`${getStoreName(p.storeId, stores)} od ${moment(getCatalogDate(p.catalogId, catalog).dateFrom).format('DD.MM.')} do ${moment(getCatalogDate(p.catalogId, catalog).dateTo).format('DD.MM.')}`}</td>
                        <td><button type="button" className="btn btn-danger" onClick={() => deleteProduct(p.id)}>Obriši proizvod</button></td>
                    </tr>
                    )
                  })
            }

            {
                (products.filter(p => moment().unix() <= p.endAt && p.catalogId === selectedCatalogId).length === 0 && selectedCatalogId !== '1') &&
                    <div>
                        <h4>
                            Nema proizvoda u katalogu
                        </h4>
                    </div>
            }
            </tbody>
        </table>
    </div>
  )
}

export default EditCatalog
