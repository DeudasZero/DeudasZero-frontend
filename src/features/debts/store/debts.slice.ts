import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getDebts,
  createDebt,
  updateDebt,
  markDebtPaid,
  deleteDebt,
} from '../services/debts.service.ts'
import type { DebtsState, DebtFormValues, FetchStatus } from '../types/debts.types.ts'

interface RootStateDebts {
  debts: DebtsState
}

const initialState: DebtsState = {
  data: null,
  isLoading: false,
  isSaving: false,
  isPatching: null,
  isDeleting: null,
  error: null,
  saveError: null,
  successMessage: null,
  currentStatus: 'ALL',
}

export const fetchDebts = createAsyncThunk(
  'debts/fetch',
  async (status: FetchStatus = 'ALL', { rejectWithValue }) => {
    try {
      return await getDebts(status)
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al cargar deudas')
    }
  },
)

export const addDebt = createAsyncThunk(
  'debts/add',
  async (values: DebtFormValues, { dispatch, getState, rejectWithValue }) => {
    try {
      await createDebt(values)
      const status = (getState() as RootStateDebts).debts.currentStatus
      return await dispatch(fetchDebts(status))
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al registrar deuda')
    }
  },
)

export const editDebt = createAsyncThunk(
  'debts/edit',
  async (
    { id, values }: { id: string; values: DebtFormValues },
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      await updateDebt(id, values)
      const status = (getState() as RootStateDebts).debts.currentStatus
      return await dispatch(fetchDebts(status))
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al actualizar deuda')
    }
  },
)

export const payDebt = createAsyncThunk(
  'debts/pay',
  async (id: string, { dispatch, getState, rejectWithValue }) => {
    try {
      await markDebtPaid(id)
      const status = (getState() as RootStateDebts).debts.currentStatus
      await dispatch(fetchDebts(status))
      return id
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al liquidar deuda')
    }
  },
)

export const removeDebt = createAsyncThunk(
  'debts/remove',
  async (id: string, { dispatch, getState, rejectWithValue }) => {
    try {
      await deleteDebt(id)
      const status = (getState() as RootStateDebts).debts.currentStatus
      await dispatch(fetchDebts(status))
      return id
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al eliminar deuda')
    }
  },
)

const debtsSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    clearMessages(s) {
      s.successMessage = null
      s.saveError = null
      s.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebts.pending, (s, a) => {
        s.isLoading = true
        s.error = null
        if (a.meta.arg) s.currentStatus = a.meta.arg
      })
      .addCase(fetchDebts.fulfilled, (s, a) => {
        s.isLoading = false
        s.data = a.payload
      })
      .addCase(fetchDebts.rejected, (s, a) => {
        s.isLoading = false
        s.error = a.payload as string
      })

    // add
    builder
      .addCase(addDebt.pending, (s) => {
        s.isSaving = true
        s.saveError = null
        s.successMessage = null
      })
      .addCase(addDebt.fulfilled, (s) => {
        s.isSaving = false
        s.successMessage = 'Deuda registrada correctamente.'
      })
      .addCase(addDebt.rejected, (s, a) => {
        s.isSaving = false
        s.saveError = a.payload as string
      })

    // edit
    builder
      .addCase(editDebt.pending, (s) => {
        s.isSaving = true
        s.saveError = null
        s.successMessage = null
      })
      .addCase(editDebt.fulfilled, (s) => {
        s.isSaving = false
        s.successMessage = 'Deuda actualizada correctamente.'
      })
      .addCase(editDebt.rejected, (s, a) => {
        s.isSaving = false
        s.saveError = a.payload as string
      })

    // pay
    builder
      .addCase(payDebt.pending, (s, a) => {
        s.isPatching = a.meta.arg
        s.successMessage = null
      })
      .addCase(payDebt.fulfilled, (s) => {
        s.isPatching = null
        s.successMessage = 'Deuda liquidada correctamente. ¡Felicitaciones! 🎉'
      })
      .addCase(payDebt.rejected, (s, a) => {
        s.isPatching = null
        s.error = a.payload as string
      })

    // remove
    builder
      .addCase(removeDebt.pending, (s, a) => {
        s.isDeleting = a.meta.arg
        s.successMessage = null
      })
      .addCase(removeDebt.fulfilled, (s) => {
        s.isDeleting = null
        s.successMessage = 'Deuda eliminada correctamente.'
      })
      .addCase(removeDebt.rejected, (s, a) => {
        s.isDeleting = null
        s.error = a.payload as string
      })
  },
})

export const { clearMessages } = debtsSlice.actions
export default debtsSlice.reducer
