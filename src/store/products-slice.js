import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getAllProducts } from '../endpoints/firestore'

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false
  },
  reducers: {
    setProducts (state, action) {
      state.products = action.payload
    },
    removeProduct (state, action) {
      state.products.forEach((item, index) => {
        if (item.id === action.payload) {
          state.products.splice(index, 1)
        }
      })
    },
    removeProductFromCatalog (state, action) {
      state.products.forEach((item, index) => {
        if (item.catalogId === action.payload) {
          state.products.splice(index, 1)
        }
      })
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchAllProducts.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.products = action.payload
      state.loading = false
    })
    builder.addCase(fetchAllProducts.rejected, state => {
      state.loading = false
    })
  }
})

export const fetchAllProducts = createAsyncThunk('products/fetchAllProducts', async () => {
  const response = await getAllProducts()
  return response
})

export const { setProducts, removeProduct, removeProductFromCatalog } = productSlice.actions
export default productSlice.reducer
