import { http } from '@/services/http.ts'
import { MOCK_DASHBOARD_DATA } from './dashboard.mock.ts'
import type { DashboardData } from '../types/dashboard.types.ts'

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const res = await http.get<DashboardData>('/dashboard')
    return res.data
  } catch {
    return MOCK_DASHBOARD_DATA
  }
}
