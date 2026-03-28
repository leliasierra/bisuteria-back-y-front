import { create } from 'zustand'
import { api } from '../lib/api'

export interface Product {
  id: number
  name: string
  material: string
  category: string
  price: number
  stock: number
  minStock: number
}

interface ProductStore {
  products: Product[]
  loading: boolean
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  updateStock: (id: number, quantity: number) => Promise<void>
  getProduct: (id: number) => Product | undefined
}

export const useProductStore = create<ProductStore>()(
  (set, get) => ({
    products: [],
    loading: false,
    fetchProducts: async () => {
      set({ loading: true })
      try {
        const products = await api.products.getAll()
        set({ products: products.data || products })
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        set({ loading: false })
      }
    },
    addProduct: async (product) => {
      try {
        const newProduct = await api.products.create(product)
        set((state) => ({ products: [...state.products, newProduct.data || newProduct] }))
      } catch (error) {
        console.error('Error adding product:', error)
      }
    },
    updateProduct: async (id, product) => {
      try {
        const updated = await api.products.update(id, product)
        set((state) => ({
          products: state.products.map((p) => p.id === id ? { ...p, ...updated.data || updated } : p)
        }))
      } catch (error) {
        console.error('Error updating product:', error)
      }
    },
    deleteProduct: async (id) => {
      try {
        await api.products.delete(id)
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }))
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    },
    updateStock: async (id, quantity) => {
      const product = get().products.find((p) => p.id === id)
      if (product) {
        await get().updateProduct(id, { stock: Math.max(0, product.stock + quantity) })
      }
    },
    getProduct: (id) => get().products.find((p) => p.id === id),
  })
)
