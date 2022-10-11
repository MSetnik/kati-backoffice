import './index.css'
import { MenuItem, Select, TextField } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { storage } from '../endpoints/firebase-config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { addProductToFirestore } from '../endpoints/firestore'

const AddProducts = (props) => {
  const { stores } = useSelector(state => state.stores)
  const { categories } = useSelector(state => state.categories)
  const { catalog } = useSelector(state => state.catalogs)

  const [imageUploadLoader, setImageUploadLoader] = useState(false)
  const [productAddedLoading, setProductAddedLoading] = useState(false)

  const [storeSelect, setStoreSelect] = useState('default')
  const [storeSelectName, setStoreSelectName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productCategory, setProductCategory] = useState('default')
  const [productName, setProductName] = useState('')
  const [fullPrice, setFullPrice] = useState('')
  const [discountedPrice, setDiscounetdPrice] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [catalogSelect, setCatalogSelect] = useState('default')
  const [catalogStart, setCatalogStart] = useState(0)
  const [catalogEnd, setCatalogEnd] = useState(0)

  const { query } = useParams()

  const catalogId = query.split('&')[0].split('=')[1]
  const storeId = query.split('&')[1].split('=')[1]

  useEffect(() => {
    setStoreSelect(storeId)
  }, [storeId !== 0])

  const getStoreName = (storeId) => {
    stores.forEach(store => {
      if (storeId === store.id) {
        setStoreSelectName(store.name)
      }
    })
  }

  const getCatalogDate = (catalogId) => {
    catalog.forEach(c => {
      if (catalogId === c.id) {
        setCatalogStart(moment.unix(c.dateFrom).toDate())
        setCatalogEnd(moment.unix(c.dateTo).toDate())
      }
    })
  }

  const uploadImage = async () => {
    if (selectedImage === null) {
      return
    }

    setImageUploadLoader(true)

    const imageRef = ref(storage, `products/${productName + (Math.random() * 1000)}`)
    return await uploadBytes(imageRef, selectedImage).then((resp) => {
      setImageUploadLoader(false)
      return getDownloadURL(resp.ref)
    })
      .catch(e => console.log(e))
  }

  const saveProduct = async () => {
    setProductAddedLoading(false)
    await uploadImage().then(async (imageUrl) => {
      await addProductToFirestore({
        catalogId: catalogId === '0' ? catalogSelect : catalogId,
        storeId: storeSelect,
        categoryId: productCategory,
        name: productName,
        description: productDescription,
        imgUrl: imageUrl,
        startAt: catalogStart,
        endAt: catalogEnd,
        fullPrice,
        discountedPrice
      })
        .catch(e => {
          alert(e)
          setProductAddedLoading(true)
        })
    })
      .catch(e => {
        alert(e)
        setProductAddedLoading(true)
      })
      .finally(() => {
        setProductAddedLoading(false)

        setProductDescription('')
        setProductName('')
        setFullPrice('')
        setDiscounetdPrice('')
        setSelectedImage(null)
      })
  }

  // TODO: POSTAVIT OGRANICENJA
  return (
    <div className="container main-container">
      <div className='col col-6'>
        <div className="row mt-3">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={storeSelect}
            label="Odaberi trgovinu"
            onChange={(e) => {
              setStoreSelect(e.target.value)
              getStoreName(e.target.value)
            }}
          >
             <MenuItem key={-1} value={'default'}>Odaberite trgovinu</MenuItem>
              {stores.map((store, index) => {
                return <MenuItem key={index} value={store.id}>{store.name}</MenuItem>
              })}
          </Select>
          {/* <TextField id="outlined-basic" label="katalog" variant="outlined" disabled value={catalogId}/> */}
        </div>

        <div className="row mt-3">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={catalogSelect}
            label="Odaberite katalog"
            onChange={(e) => {
              setCatalogSelect(e.target.value)
              getCatalogDate(e.target.value)
            }}
          >
             <MenuItem key={-1}value={'default'}>Odaberite katalog</MenuItem>
            {catalog.map((catalog, index) => {
              // prikazi samo kataloge koji su bili unazad mjesec dana (2629743 s = 30,44 dana)

              if (catalog.storeId === storeSelect && ((Date.now().toString().substr(0, 10) - 2629743).toString()) < catalog.dateFrom) {
                return <MenuItem key={index} value={catalog.id}>{`${storeSelectName} od ${moment.unix(catalog.dateFrom).format('DD.MM.YY')} do ${moment.unix(catalog.dateTo).format('DD.MM.YY')}`}</MenuItem>
              }
              return null
            })}
          </Select>
          {/* <TextField id="outlined-basic" label="katalog" variant="outlined" disabled value={catalogId}/> */}
        </div>

        <div className="row mt-3">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={productCategory}
            label="Odaberi kategoriju"
            onChange={(e) => setProductCategory(e.target.value)}
          >
             <MenuItem key={-1} value={'default'}>Odaberite kategoriju proizvoda</MenuItem>
              {categories.map((category, index) => {
                return <MenuItem key={index} value={category.id}>{category.name}</MenuItem>
              })}
          </Select>
          {/* <TextField id="outlined-basic" label="katalog" variant="outlined" disabled value={catalogId}/> */}
        </div>
        <div className="row mt-3">
          <TextField id="outlined-basic" label="Naziv proizvoda" variant="outlined" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </div>
        <div className="row mt-3">
          <TextField id="outlined-basic" label="Opis proizvoda (opcionalno)" variant="outlined" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
        </div>
        <div className="row mt-3">
          <div className='col col-6'>
            <TextField type={'number'} id="outlined-basic" label="Puna cijena" variant="outlined" value={fullPrice} onChange={(e) => setFullPrice(e.target.value)}/>
          </div>
          <div className='col col-6'>
            <TextField type={'number'} id="outlined-basic" label="Snizena cijena" variant="outlined" value={discountedPrice} onChange={(e) => setDiscounetdPrice(e.target.value)} />
          </div>
        </div>

        <div className="row mt-3">
          <input type={'file'} onChange={(e) => setSelectedImage(e.target.files[0])} />
        </div>
      </div>

      <div className="row mt-3">
        <button disabled={productAddedLoading} type="button" className="btn btn-primary" onClick={() => saveProduct()}>Dodaj proizvod</button>
      </div>
   </div>
  )
}

export default AddProducts
