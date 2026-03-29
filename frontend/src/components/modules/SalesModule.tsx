import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FaDollarSign, FaArrowUp, FaShoppingCart, FaPlus, FaTrash, FaBox, FaExclamationTriangle, FaSearch, FaSortAmountUp, FaSortAmountDown } from "react-icons/fa"
import { useSaleStore } from "@/stores/saleStore"
import { useProductStore } from "@/stores/productStore"

export function SalesModule() {
  const { sales, addSale, deleteSale } = useSaleStore()
  const { products, updateStock } = useProductStore()
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProduct, setFilterProduct] = useState("")
  const [sortField, setSortField] = useState<"date" | "total" | "productName" | "createdAt">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredSales = sales
    .filter(sale => {
      const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesProduct = !filterProduct || sale.productId.toString() === filterProduct
      return matchesSearch && matchesProduct
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortField === "date") {
        comparison = a.date.localeCompare(b.date)
      } else if (sortField === "total") {
        comparison = a.total - b.total
      } else if (sortField === "productName") {
        comparison = a.productName.localeCompare(b.productName)
      } else if (sortField === "createdAt") {
        const dateA = a.createdAt || ''
        const dateB = b.createdAt || ''
        comparison = dateA.localeCompare(dateB)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0)
  const totalItems = sales.reduce((acc, sale) => acc + sale.quantity, 0)
  
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0)
  const lowStockProducts = products.filter(p => p.stock <= p.minStock)

  const selectedProduct = products.find(p => p.id.toString() === selectedProductId)
  const calculatedTotal = selectedProduct && quantity 
    ? selectedProduct.price * parseInt(quantity) 
    : 0

  const handleAddSale = () => {
    if (!selectedProductId || !quantity || !selectedProduct) return
    
    const qty = parseInt(quantity)
    if (qty > selectedProduct.stock) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    addSale({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: qty,
      unitPrice: selectedProduct.price,
      total: selectedProduct.price * qty,
      date: new Date().toISOString().split('T')[0]
    })

    updateStock(selectedProduct.id, -qty)
    
    setSelectedProductId("")
    setQuantity("")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FaShoppingCart className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Módulo de Ventas</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <FaDollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
            <CardTitle className="text-sm font-medium">Items Vendidos</CardTitle>
            <FaArrowUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalItems}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <FaShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{sales.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <FaBox className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStock}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <FaBox className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{products.length}</div>
          </CardContent>
        </Card>
        <Card className={`border-primary/20 ${lowStockProducts.length > 0 ? "border-red-300 bg-red-50" : ""}`}>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${lowStockProducts.length > 0 ? "bg-red-100" : "bg-primary/5"}`}>
            <CardTitle className={`text-sm font-medium ${lowStockProducts.length > 0 ? "text-red-600" : ""}`}>Stock Bajo</CardTitle>
            <FaExclamationTriangle className={`h-4 w-4 ${lowStockProducts.length > 0 ? "text-red-500" : "text-primary"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStockProducts.length > 0 ? "text-red-500" : "text-primary"}`}>
              {lowStockProducts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-primary">Registrar Nueva Venta</CardTitle>
          <CardDescription>Selecciona un producto del inventario</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="product">Producto</Label>
              <select
                id="product"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Seleccionar producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id} disabled={product.stock === 0}>
                    {product.name} - Stock: {product.stock} - ${product.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="1"
                min="1"
                max={selectedProduct?.stock || 1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                type="number"
                placeholder="0"
                value={calculatedTotal || ""}
                readOnly
                className="bg-primary/5"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddSale} disabled={!selectedProductId || !quantity}>
                <FaPlus className="mr-2 h-4 w-4" /> Registrar Venta
              </Button>
            </div>
          </div>

          {selectedProduct && quantity && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <p className="text-sm">
                <strong>Producto:</strong> {selectedProduct.name} | 
                <strong> Precio unitario:</strong> ${selectedProduct.price.toLocaleString()} | 
                <strong> Stock disponible:</strong> {selectedProduct.stock}
              </p>
            </div>
          )}

          {showSuccess && (
            <Alert className="mt-4 border-green-500 bg-green-50">
              <FaArrowUp className="h-4 w-4" />
              <AlertTitle>¡Venta Registrada!</AlertTitle>
              <AlertDescription>La venta se ha registrado y el stock ha sido actualizado.</AlertDescription>
            </Alert>
          )}

          {showError && (
            <Alert variant="destructive" className="mt-4">
              <FaShoppingCart className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>No hay suficiente stock disponible para esta venta.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-primary">Historial de Ventas</CardTitle>
          <CardDescription>Lista de ventas realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="w-full h-10 px-3 border rounded-md bg-background"
              >
                <option value="">Todos los productos</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-1">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as "date" | "total" | "productName" | "createdAt")}
                className="h-10 px-3 border rounded-md bg-background"
              >
                <option value="createdAt">Fecha</option>
                <option value="date">Fecha (date)</option>
                <option value="productName">Producto</option>
                <option value="total">Total</option>
              </select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                title={sortDirection === "asc" ? "Ascendente" : "Descendente"}
              >
                {sortDirection === "asc" ? <FaSortAmountUp className="h-4 w-4" /> : <FaSortAmountDown className="h-4 w-4" />}
              </Button>
            </div>
            {(searchTerm || filterProduct) && (
              <Button
                variant="ghost"
                onClick={() => { setSearchTerm(""); setFilterProduct(""); }}
              >
                Limpiar
              </Button>
            )}
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            Mostrando {filteredSales.length} de {sales.length} ventas
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                <TableHead className="text-primary">Producto</TableHead>
                <TableHead className="text-primary">Cantidad</TableHead>
                <TableHead className="text-primary">Total</TableHead>
                <TableHead className="text-primary">Fecha</TableHead>
                <TableHead className="text-primary">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No se encontraron ventas
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-primary/5">
                  <TableCell className="font-medium">{sale.productName}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell className="text-primary font-semibold">${sale.total.toLocaleString()}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar venta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará la venta de "{sale.productName}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteSale(sale.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
