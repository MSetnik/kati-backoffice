import { configureStore } from '@reduxjs/toolkit'
import storeReducer from './store-slice'
import categoryReducer from './category-slice'
import catalogReducer from './catalog-slice'
import productsReducer from './products-slice'

export const store = configureStore({
  reducer: {
    stores: storeReducer,
    categories: categoryReducer,
    catalogs: catalogReducer,
    products: productsReducer
  }
})
