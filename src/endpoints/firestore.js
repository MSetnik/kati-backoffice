import { firestore } from './firebase-config'
import { doc, addDoc, collection, deleteDoc, getDocs } from 'firebase/firestore'

export const getStoreData = async () => {
  const storeCol = collection(firestore, 'store')
  const storeSnapshot = await getDocs(storeCol)
  const lStores = storeSnapshot.docs.map(doc => {
    const store = {
      id: doc.id,
      name: doc.data().name,
      imgUrl: doc.data().imgUrl
    }
    return store
  })
  return lStores
}

export const addNewCatalogToDb = async ({ storeId, dateFrom, dateTo }) => {
  const addedCatalogId = await addDoc(collection(firestore, 'catalog'), {
    storeId,
    dateFrom,
    dateTo
  })
    .then(r => {
      return r.id
    })
    .catch(e => console.log(e))

  return addedCatalogId
}

// add new category to firestore
export const addNewCategoryToDb = async ({ categoryName }) => {
  const addedCategoryId = await addDoc(collection(firestore, 'category'), {
    name: categoryName
  })
    .then(r => {
      return r.id
    })
    .catch(e => console.log(e))

  return addedCategoryId
}

// Fetching category data
export const getCategories = async () => {
  const storeCol = collection(firestore, 'category')
  const categorySnapshot = await getDocs(storeCol)
  const lCategories = categorySnapshot.docs.map(doc => {
    const category = {
      id: doc.id,
      name: doc.data().name
    }
    return category
  })
  return lCategories
}

// Fetching catalog data
export const getAllCatalog = async () => {
  const catalogCol = collection(firestore, 'catalog')
  const catalogSnapshot = await getDocs(catalogCol)
  const lCatalogs = catalogSnapshot.docs.map(doc => {
    const catalog = {
      id: doc.id,
      storeId: doc.data().storeId,
      dateFrom: doc.data().dateFrom.seconds,
      dateTo: doc.data().dateTo.seconds
    }
    return catalog
  })

  return lCatalogs
}

// add product to firestore
export const addProductToFirestore = async ({ catalogId, storeId, categoryId, name, description, fullPrice, discountedPrice, imgUrl, startAt, endAt }) => {
  const addProductToDB = await addDoc(collection(firestore, 'product'), {
    catalogId,
    storeId,
    categoryId,
    name,
    description,
    fullPrice,
    discountedPrice,
    imgUrl,
    startAt,
    endAt
  })
    .then(r => {
      return r.id
    })
    .catch(e => console.log(e))

  return addProductToDB
}

// Fetching products data
export const getAllProducts = async () => {
  const productsCol = collection(firestore, 'product')
  const productsSnapshot = await getDocs(productsCol)
  const lProducts = productsSnapshot.docs.map(doc => {
    const product = {
      id: doc.id,
      name: doc.data().name,
      categoryId: doc.data().categoryId,
      storeId: doc.data().storeId,
      description: doc.data().description,
      fullPrice: doc.data().fullPrice,
      discountedPrice: doc.data().discountedPrice,
      imgUrl: doc.data().imgUrl,
      startAt: doc.data().startAt.seconds,
      endAt: doc.data().endAt.seconds,
      catalogId: doc.data().catalogId
    }
    return product
  })
  return lProducts
}

// Fetching products data
export const removeProductFromDB = async (productId) => {
  await deleteDoc(doc(firestore, 'product', productId))
}
