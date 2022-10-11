import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getStoreData } from '../endpoints/firestore'

const storeSlice = createSlice({
  name: 'stores',
  initialState: {
    stores: [],
    loading: false
  },
  reducers: {
    setStores (state, action) {
      state.stores = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchStores.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchStores.fulfilled, (state, action) => {
      state.stores = action.payload
      state.loading = false
    })
    builder.addCase(fetchStores.rejected, state => {
      state.loading = false
    })
  }
})

export const fetchStores = createAsyncThunk('stores/fetchStores', async () => {
  const response = await getStoreData()
  return response
})

export const { setStores } = storeSlice.actions
export default storeSlice.reducer
