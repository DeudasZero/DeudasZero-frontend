import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  getActivePlan,
  generatePlan,
  payInstallment,
  sendChatMessage as apiSendChat,
  getWhatIfAnalysis,
  getAiReport,
} from '../services/plan-ia.service.ts'
import type {
  PlanIAState,
  PaymentStrategy,
  ChatMessage,
  ApiStrategy,
} from '../types/plan-ia.types.ts'
import { makeUserMessage, makeAIMessage } from '../utils/chat.utils.ts'

const initialState: PlanIAState = {
  strategy: 'avalanche',
  plan: null,
  messages: [],
  isLoadingPlan: false,
  isGenerating: false,
  isSendingChat: false,
  isMarkingPaid: null,
  planError: null,
  chatError: null,
  successMessage: null,
}

export const fetchActivePlan = createAsyncThunk(
  'planIA/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      return await getActivePlan()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error'
      if (msg.includes('404') || msg.toLowerCase().includes('not found')) return null
      return rejectWithValue(msg)
    }
  },
)

export const createPlan = createAsyncThunk(
  'planIA/generate',
  async (strategy: ApiStrategy, { rejectWithValue }) => {
    try {
      return await generatePlan(strategy)
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al generar plan')
    }
  },
)

export const markInstallmentPaid = createAsyncThunk(
  'planIA/markPaid',
  async (installmentId: string, { rejectWithValue }) => {
    try {
      return await payInstallment(installmentId)
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al registrar pago')
    }
  },
)

export const loadAiReport = createAsyncThunk(
  'planIA/loadReport',
  async (_, { rejectWithValue }) => {
    try {
      return await getAiReport()
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al cargar reporte IA')
    }
  },
)

export const sendMessage = createAsyncThunk(
  'planIA/sendMessage',
  async (text: string, { dispatch, rejectWithValue }) => {
    dispatch(addMessage(makeUserMessage(text)))

    try {
      const amountMatch = text.match(/\$?([\d.,]+)[k|K]?/)
      const isWhatIf =
        text.toLowerCase().includes('abono') ||
        text.toLowerCase().includes('extra') ||
        text.toLowerCase().includes('si pago') ||
        text.toLowerCase().includes('what-if')

      let response: string
      let tag: ChatMessage['tag'] | undefined

      if (isWhatIf && amountMatch) {
        const raw = amountMatch[1]!.replace(/\./g, '').replace(',', '.')
        const amount = text.toLowerCase().includes('k') ? parseFloat(raw) * 1000 : parseFloat(raw)
        if (!isNaN(amount) && amount > 0) {
          response = await getWhatIfAnalysis(amount)
          tag = 'WHAT-IF'
        } else {
          response = await apiSendChat(text)
        }
      } else {
        response = await apiSendChat(text)
      }

      return { response, tag }
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al enviar mensaje')
    }
  },
)

const planIASlice = createSlice({
  name: 'planIA',
  initialState,
  reducers: {
    setStrategy(state, action: PayloadAction<PaymentStrategy>) {
      state.strategy = action.payload
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload)
    },
    clearMessages(state) {
      state.successMessage = null
      state.chatError = null
      state.planError = null
    },
  },
  extraReducers: (builder) => {
    // fetchActivePlan
    builder
      .addCase(fetchActivePlan.pending, (s) => {
        s.isLoadingPlan = true
        s.planError = null
      })
      .addCase(fetchActivePlan.fulfilled, (s, a) => {
        s.isLoadingPlan = false
        s.plan = a.payload
        if (a.payload) {
          s.strategy = a.payload.strategy === 'AVALANCHE' ? 'avalanche' : 'snowball'
        }
      })
      .addCase(fetchActivePlan.rejected, (s, a) => {
        s.isLoadingPlan = false
        s.planError = a.payload as string
      })

    // createPlan
    builder
      .addCase(createPlan.pending, (s) => {
        s.isGenerating = true
        s.planError = null
        s.successMessage = null
      })
      .addCase(createPlan.fulfilled, (s, a) => {
        s.isGenerating = false
        s.plan = a.payload
        s.strategy = a.payload.strategy === 'AVALANCHE' ? 'avalanche' : 'snowball'
        s.successMessage = 'Plan generado correctamente.'
        if (a.payload.aiSummary) {
          s.messages.push(makeAIMessage(a.payload.aiSummary))
        }
      })
      .addCase(createPlan.rejected, (s, a) => {
        s.isGenerating = false
        s.planError = a.payload as string
      })

    // markInstallmentPaid
    builder
      .addCase(markInstallmentPaid.pending, (s, a) => {
        s.isMarkingPaid = a.meta.arg
        s.successMessage = null
      })
      .addCase(markInstallmentPaid.fulfilled, (s, a) => {
        s.isMarkingPaid = null
        s.successMessage = 'Pago registrado correctamente.'
        if (s.plan) {
          const idx = s.plan.installments.findIndex((i) => i.id === a.payload.id)
          if (idx !== -1) {
            s.plan.installments[idx] = a.payload
            s.plan.paidInstallments++
          }
        }
      })
      .addCase(markInstallmentPaid.rejected, (s, a) => {
        s.isMarkingPaid = null
        s.chatError = a.payload as string
      })

    // loadAiReport
    builder.addCase(loadAiReport.fulfilled, (s, a) => {
      if (s.messages.length === 0) {
        s.messages.push(makeAIMessage(`${a.payload.diagnosis}\n\n${a.payload.context}`))
      }
    })

    // sendMessage
    builder
      .addCase(sendMessage.pending, (s) => {
        s.isSendingChat = true
        s.chatError = null
      })
      .addCase(sendMessage.fulfilled, (s, a) => {
        s.isSendingChat = false
        s.messages.push(makeAIMessage(a.payload.response, a.payload.tag))
      })
      .addCase(sendMessage.rejected, (s, a) => {
        s.isSendingChat = false
        s.chatError = a.payload as string
        s.messages.push(makeAIMessage('Hubo un error al procesar tu mensaje. Intenta de nuevo.'))
      })
  },
})

export const { setStrategy, addMessage, clearMessages } = planIASlice.actions
export default planIASlice.reducer
