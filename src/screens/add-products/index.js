import './index.css'
import { InputLabel, MenuItem, Select, TextField } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { storage } from '../../endpoints/firebase-config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { addProductToFirestore } from '../../endpoints/firestore'
import SearchableSelect from '../../components/organisms/searchable-select-mui'

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
  const [catalogStart, setCatalogStart] = useState()
  const [catalogEnd, setCatalogEnd] = useState()

  const { query } = useParams()

  const catalogId = query.split('&')[0].split('=')[1]
  const storeId = query.split('&')[1].split('=')[1]

  const imageInput = useRef(null)

  useEffect(() => {
    if (storeId !== '0') {
      setStoreSelect(storeId)
      getStoreName(storeId)
    }

    if (catalogId !== '0') {
      setCatalogSelect(catalogId)
      getCatalogDate(catalogId)
    }
  }, [])

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

  const saveProduct = async (event) => {
    if (
      storeSelect !== 'default' &&
      catalogSelect !== 'default' &&
      productCategory !== 'default' &&
      productName !== '' &&
      fullPrice !== '' &&
      // discountedPrice !== '' &&
      fullPrice !== 0 &&
      discountedPrice !== 0 &&
      fullPrice >= discountedPrice
    ) {
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
          fullPrice: fullPrice.toString(),
          discountedPrice: productCategory === '1' ? fullPrice.toString() : discountedPrice.toString()
        })
          .then(() => {
            alert('Dodano')
            setProductAddedLoading(false)
            imageInput.current.value = null
            setProductDescription('')
            setProductName('')
            setFullPrice('')
            setDiscounetdPrice('')
            setSelectedImage(null)
          })
          .catch(e => {
            alert(e)
            setProductAddedLoading(false)
          })
      })
        .catch(e => {
          alert(e)
          setProductAddedLoading(false)
        })
    } else {
      if (parseFloat(fullPrice) < parseFloat(discountedPrice)) {
        alert('Puna cijena mora biti veca od snizene')
      } else {
        alert('Ispunite sva polja')
      }
    }
  }

  // TODO: POSTAVIT OGRANICENJA
  return (
    <div className="container main-container">
      <div className='col col-6'>
        <div className="row mt-3">
          <Select
            value={storeSelect}
            style={{ width: '100%' }}
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
          {/* <SearchableSelect selectOptions={categories} selectedId={productCategory} setSelectedId={setProductCategory}/> */}
          <Select
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
          {
            productCategory !== '1' &&
            <div className='col col-6'>
              <TextField type={'number'} id="outlined-basic" label="Snizena cijena" variant="outlined" value={discountedPrice} onChange={(e) => setDiscounetdPrice(e.target.value)} />
            </div>
          }

        </div>

        <div className="row mt-3">
          <input ref={imageInput} type={'file'} onChange={(e) => setSelectedImage(e.target.files[0])} />
        </div>
      </div>

      <div className="row mt-3">
        <button disabled={productAddedLoading} type="button" className="btn btn-primary" onClick={(e) => saveProduct(e)}>Dodaj proizvod</button>
      </div>
   </div>
  )
}

export default AddProducts
