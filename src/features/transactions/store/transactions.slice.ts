import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getTransactions,
  createTransaction,
  deleteIncome,
  deleteExpense,
} from '../services/transactions.service.ts'
import { fetchDashboard } from '@/features/dashboard/store/dashboard.slice.ts'
import type {
  TransactionsState,
  NewTransactionForm,
  Transaction,
} from '../types/transactions.types.ts'

const initialState: TransactionsState = {
  data: null,
  isLoading: false,
  isSaving: false,
  isDeleting: null,
  error: null,
  saveError: null,
  successMessage: null,
  deleteError: null,
}

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getTransactions()
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al cargar movimientos')
    }
  },
)

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (form: NewTransactionForm, { dispatch, rejectWithValue }) => {
    try {
      await createTransaction(form)
      await Promise.all([dispatch(fetchTransactions()), dispatch(fetchDashboard())])
      return undefined
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al guardar movimiento')
    }
  },
)

export const removeTransaction = createAsyncThunk(
  'transactions/remove',
  async (tx: Pick<Transaction, 'id' | 'type'>, { dispatch, rejectWithValue }) => {
    try {
      if (tx.type === 'income') {
        await deleteIncome(tx.id)
      } else {
        await deleteExpense(tx.id)
      }
      await Promise.all([dispatch(fetchTransactions()), dispatch(fetchDashboard())])
      return tx.id
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al eliminar movimiento')
    }
  },
)

const slice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearSaveError(s) {
      s.saveError = null
    },
    clearMessages(s) {
      s.successMessage = null
      s.saveError = null
      s.deleteError = null
      s.error = null
    },
  },
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchTransactions.pending, (s) => {
        s.isLoading = true
        s.error = null
      })
      .addCase(fetchTransactions.fulfilled, (s, a) => {
        s.isLoading = false
        s.data = a.payload
      })
      .addCase(fetchTransactions.rejected, (s, a) => {
        s.isLoading = false
        s.error = a.payload as string
      })

    // add
    builder
      .addCase(addTransaction.pending, (s) => {
        s.isSaving = true
        s.saveError = null
        s.successMessage = null
      })
      .addCase(addTransaction.fulfilled, (s) => {
        s.isSaving = false
        s.successMessage = 'Movimiento registrado correctamente.'
      })
      .addCase(addTransaction.rejected, (s, a) => {
        s.isSaving = false
        s.saveError = a.payload as string
      })

    // remove
    builder
      .addCase(removeTransaction.pending, (s, a) => {
        s.isDeleting = a.meta.arg.id
        s.deleteError = null
        s.successMessage = null
      })
      .addCase(removeTransaction.fulfilled, (s) => {
        s.isDeleting = null
        s.successMessage = 'Movimiento eliminado correctamente.'
      })
      .addCase(removeTransaction.rejected, (s, a) => {
        s.isDeleting = null
        s.deleteError = a.payload as string
      })
  },
})

export const { clearSaveError, clearMessages } = slice.actions
export default slice.reducer
