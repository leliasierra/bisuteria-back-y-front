import { useEffect } from "react"
import { NavLink, Navigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaBox, FaShoppingCart, FaHeart, FaExclamationTriangle, FaCheckCircle, FaSignOutAlt } from "react-icons/fa"
import { ProductsModule } from "@/components/modules/ProductsModule"
import { SalesModule } from "@/components/modules/SalesModule"
import { LoginModule } from "@/components/modules/LoginModule"
import { useProductStore } from "@/stores/productStore"
import { useSaleStore } from "@/stores/saleStore"
import { useAuthStore } from "@/stores/authStore"
import { Routes, Route } from "react-router-dom"

function Home() {
  const { products } = useProductStore()
  
  const totalProducts = products.length
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0)
  const lowStockProducts = products.filter(p => p.stock <= p.minStock)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Sistema de Gestión</h2>
        <p className="text-xl text-muted-foreground">
          Bisutería "Hechos Con Amor"
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FaBox className="h-6 w-6 text-primary" />
              <CardTitle>Productos e Inventario</CardTitle>
            </div>
            <CardDescription>Gestiona el catálogo y controla el stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalProducts}</p>
                <p className="text-xs text-muted-foreground">Productos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalStock}</p>
                <p className="text-xs text-muted-foreground">Total Stock</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${lowStockProducts.length > 0 ? "text-red-500" : "text-green-500"}`}>
                  {lowStockProducts.length}
                </p>
                <p className="text-xs text-muted-foreground">Stock Bajo</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <NavLink to="/productos">Gestionar Productos</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FaShoppingCart className="h-6 w-6 text-primary" />
              <CardTitle>Ventas</CardTitle>
            </div>
            <CardDescription>Registra y controla las ventas del día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              {lowStockProducts.length > 0 ? (
                <div className="flex items-center gap-2 text-destructive">
                  <FaExclamationTriangle className="h-5 w-5" />
                  <span>{lowStockProducts.length} productos con stock bajo</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <FaCheckCircle className="h-5 w-5" />
                  <span>Inventario OK</span>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full" asChild>
              <NavLink to="/ventas">Registrar Ventas</NavLink>
            </Button>
          </CardContent>
        </Card>
      </div>

      {lowStockProducts.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <FaExclamationTriangle className="h-5 w-5" />
              Alerta de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Los siguientes productos necesitan reposición: {lowStockProducts.map(p => p.name).join(", ")}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sistema de inventario y ventas para emprendimiento de bisutería.
            Desarrollado con React, TypeScript y componentes UI modernos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function App() {
  const { isAuthenticated, logout, user } = useAuthStore()
  const fetchProducts = useProductStore((state) => state.fetchProducts)
  const fetchSales = useSaleStore((state) => state.fetchSales)

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
      fetchSales()
    }
  }, [isAuthenticated, fetchProducts, fetchSales])

  if (!isAuthenticated) {
    return <LoginModule />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaHeart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-2xl font-bold">Hechos Con Amor</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Hola, {user?.username}</span>
            <nav className="flex gap-2">
              <Button variant="ghost" asChild>
                <NavLink to="/">Inicio</NavLink>
              </Button>
              <Button variant="ghost" asChild>
                <NavLink to="/productos">Productos</NavLink>
              </Button>
              <Button variant="ghost" asChild>
                <NavLink to="/ventas">Ventas</NavLink>
              </Button>
            </nav>
            <Button variant="outline" size="icon" onClick={logout} title="Cerrar sesión">
              <FaSignOutAlt className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductsModule />} />
          <Route path="/ventas" element={<SalesModule />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
