import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCategories } from '../endpoints/firestore'

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false
  },
  reducers: {
    setCategories (state, action) {
      state.categories = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchCategories.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload
      state.loading = false
    })
    builder.addCase(fetchCategories.rejected, state => {
      state.loading = false
    })
  }
})

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await getCategories()
  return response
})

export const { setCategories } = categorySlice.actions
export default categorySlice.reducer
