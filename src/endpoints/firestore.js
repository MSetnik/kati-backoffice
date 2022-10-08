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
  console.log(storeId, dateFrom, dateTo)
  await addDoc(collection(firestore, 'catalog'), {
    storeId,
    dateFrom,
    dateTo
  }).then(r => console.log(r)).catch(e => console.log(e))
}
