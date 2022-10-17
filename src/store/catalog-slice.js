import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAllCatalog, getStoreCatalog } from '../endpoints/firestore'

const catalogSlice = createSlice({
  name: 'catalogs',
  initialState: {
    catalog: [],
    storeCatalog: [],
    loading: false
  },
  reducers: {
    setCatalogs (state, action) {
      state.catalog = action.payload
    },
    addNewCatalog (state, action) {
      state.catalog.push(action.payload)
    },
    removeCatalog (state, action) {
      state.catalog.forEach((item, index) => {
        if (item.id === action.payload) {
          state.catalog.splice(index, 1)
        }
      })
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchCatalogs.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchCatalogs.fulfilled, (state, action) => {
      state.catalog = action.payload
      state.loading = false
    })
    builder.addCase(fetchCatalogs.rejected, state => {
      state.loading = false
    })
  }
})

export const fetchCatalogs = createAsyncThunk('catalogs/fetchCatalogs', async () => {
  const response = await getAllCatalog()
  return response
})

export const { setCatalogs, addNewCatalog, removeCatalog } = catalogSlice.actions
export default catalogSlice.reducer
