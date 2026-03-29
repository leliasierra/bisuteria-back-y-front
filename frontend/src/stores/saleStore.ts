import { create } from 'zustand'
import { api } from '../lib/api'

export interface Sale {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  total: number
  date: string
  createdAt?: string
}

interface SaleStore {
  sales: Sale[]
  loading: boolean
  fetchSales: () => Promise<void>
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>
  deleteSale: (id: number) => Promise<void>
}

export const useSaleStore = create<SaleStore>()(
  (set) => ({
    sales: [],
    loading: false,
    fetchSales: async () => {
      set({ loading: true })
      try {
        const sales = await api.sales.getAll()
        set({ sales: sales.data || sales })
      } catch (error) {
        console.error('Error fetching sales:', error)
      } finally {
        set({ loading: false })
      }
    },
    addSale: async (sale) => {
      try {
        const newSale = await api.sales.create(sale)
        set((state) => ({ sales: [...state.sales, newSale.data || newSale] }))
      } catch (error) {
        console.error('Error adding sale:', error)
      }
    },
    deleteSale: async (id) => {
      try {
        set((state) => ({
          sales: state.sales.filter((s) => s.id !== id)
        }))
      } catch (error) {
        console.error('Error deleting sale:', error)
      }
    },
  })
)
