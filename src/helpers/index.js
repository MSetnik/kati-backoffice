import moment from 'moment'

export const getStoreName = (storeId, lStores) => {
  let storeName
  lStores.forEach(store => {
    if (storeId === store.id) {
      storeName = store.name
    }
  })
  return storeName
}

export const getCatalogDate = (catalogId, lCatalogs) => {
  let catalogDate
  lCatalogs.forEach(c => {
    if (catalogId === c.id) {
      catalogDate = {
        dateFrom: moment.unix(c.dateFrom).toDate(),
        dateTo: moment.unix(c.dateTo).toDate()
      }
    }
  })
  return catalogDate
}

export const getCategoryName = (categoryId, lCategories) => {
  let categoryName
  lCategories.forEach(c => {
    if (categoryId === c.id) {
      categoryName = c.name
    }
  })
  return categoryName
}
