import { firestore } from './firebase-config'
import { addDoc, collection, getDocs } from 'firebase/firestore'

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

export const addNewCatalog = async ({ storeId, dateFrom, dateTo }) => {
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
