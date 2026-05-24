import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getProfile, updateBasicInfo, updateFinancialBase } from '../services/profile.service.ts'
import type {
  ProfileState,
  Profile,
  BasicInfoFormValues,
  FinancialBaseFormValues,
} from '../types/profile.types.ts'

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: null,
}

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getProfile()
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Error')
  }
})

export const saveBasicInfo = createAsyncThunk(
  'profile/saveBasic',
  async (values: BasicInfoFormValues, { rejectWithValue }) => {
    try {
      return await updateBasicInfo(values)
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al guardar')
    }
  },
)

export const saveFinancialBase = createAsyncThunk(
  'profile/saveFinancial',
  async (values: FinancialBaseFormValues, { rejectWithValue }) => {
    try {
      return await updateFinancialBase(values)
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al guardar')
    }
  },
)

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchProfile.pending, (s) => {
        s.isLoading = true
        s.error = null
      })
      .addCase(fetchProfile.fulfilled, (s, a: PayloadAction<Profile>) => {
        s.isLoading = false
        s.data = a.payload
      })
      .addCase(fetchProfile.rejected, (s, a) => {
        s.isLoading = false
        s.error = a.payload as string
      })
    // save basic
    builder
      .addCase(saveBasicInfo.pending, (s) => {
        s.isSaving = true
        s.error = null
        s.successMessage = null
      })
      .addCase(saveBasicInfo.fulfilled, (s, a: PayloadAction<Profile>) => {
        s.isSaving = false
        s.data = a.payload
        s.successMessage = 'Información básica guardada correctamente.'
      })
      .addCase(saveBasicInfo.rejected, (s, a) => {
        s.isSaving = false
        s.error = a.payload as string
      })
    // save financial
    builder
      .addCase(saveFinancialBase.pending, (s) => {
        s.isSaving = true
        s.error = null
        s.successMessage = null
      })
      .addCase(saveFinancialBase.fulfilled, (s, a: PayloadAction<Profile>) => {
        s.isSaving = false
        s.data = a.payload
        s.successMessage = 'Base financiera actualizada. El consejero IA calibrará tu plan.'
      })
      .addCase(saveFinancialBase.rejected, (s, a) => {
        s.isSaving = false
        s.error = a.payload as string
      })
  },
})

export const { clearMessages } = profileSlice.actions
export default profileSlice.reducer
