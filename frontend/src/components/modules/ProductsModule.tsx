import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { FaBox, FaPlus, FaTrash, FaShoppingCart, FaPen, FaCheck, FaChevronDown } from "react-icons/fa"
import { useProductStore } from "@/stores/productStore"

function Combobox({ 
  value, 
  onChange, 
  options = [], 
  placeholder 
}: { 
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredOptions = options.filter(opt => 
    (opt || "").toLowerCase().includes((search || "").toLowerCase())
  )

  const showCreateOption = search && !options.some(
    opt => (opt || "").toLowerCase() === (search || "").toLowerCase()
  )

  return (
    <div className="relative">
      <div className="flex">
        <Input
          value={value || search}
          placeholder={placeholder}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="rounded-r-none"
        />
        <Button
          variant="outline"
          size="icon"
          className="rounded-l-none border-l-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaChevronDown className="h-4 w-4" />
        </Button>
      </div>
      
      {isOpen && (filteredOptions.length > 0 || showCreateOption) && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option}
              className="px-3 py-2 cursor-pointer hover:bg-primary/10 flex items-center gap-2"
              onClick={() => {
                onChange(option)
                setSearch("")
                setIsOpen(false)
              }}
            >
              <FaCheck className={`h-4 w-4 ${value === option ? "opacity-100" : "opacity-0"}`} />
              {option}
            </div>
          ))}
          {showCreateOption && (
            <div
              className="px-3 py-2 cursor-pointer hover:bg-primary/10 text-primary font-medium flex items-center gap-2 border-t"
              onClick={() => {
                onChange(search)
                setSearch("")
                setIsOpen(false)
              }}
            >
              <FaPlus className="h-4 w-4" />
              Crear "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ProductsModule() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore()
  const [newProduct, setNewProduct] = useState({ name: "", material: "", category: "", price: "", stock: "", minStock: "5" })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState({ name: "", material: "", category: "", price: "", stock: "", minStock: "5" })
  const [showSuccess, setShowSuccess] = useState(false)

  const existingMaterials = [...new Set(products.map(p => p.material))]
  const existingCategories = [...new Set(products.map(p => p.category))]

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return
    
    addProduct({
      name: newProduct.name,
      material: newProduct.material || "General",
      category: newProduct.category || "General",
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      minStock: parseInt(newProduct.minStock) || 5,
    })
    
    setNewProduct({ name: "", material: "", category: "", price: "", stock: "", minStock: "5" })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const startEdit = (product: any) => {
    setEditingId(product.id)
    setEditData({
      name: product.name,
      material: product.material,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString()
    })
  }

  const saveEdit = () => {
    if (!editData.name || !editData.price || editingId === null) return
    updateProduct(editingId, {
      name: editData.name,
      material: editData.material || "General",
      category: editData.category || "General",
      price: parseFloat(editData.price),
      stock: parseInt(editData.stock) || 0,
      minStock: parseInt(editData.minStock) || 5,
    })
    setEditingId(null)
    setEditData({ name: "", material: "", category: "", price: "", stock: "", minStock: "5" })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({ name: "", material: "", category: "", price: "", stock: "", minStock: "5" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FaBox className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Módulo de Productos e Inventario</h2>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-primary">{editingId ? "Editar Producto" : "Agregar Nuevo Producto"}</CardTitle>
          <CardDescription>Gestiona productos y controla el inventario</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="name">Nombre del producto</Label>
              <Input
                id="name"
                placeholder="Ej: Collar de perlas"
                value={editingId ? editData.name : newProduct.name}
                onChange={(e) => editingId 
                  ? setEditData({ ...editData, name: e.target.value })
                  : setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Combobox
                value={editingId ? editData.material : newProduct.material}
                onChange={(value) => editingId
                  ? setEditData({ ...editData, material: value })
                  : setNewProduct({ ...newProduct, material: value })
                }
                options={existingMaterials}
                placeholder="Seleccionar o crear material"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Combobox
                value={editingId ? editData.category : newProduct.category}
                onChange={(value) => editingId
                  ? setEditData({ ...editData, category: value })
                  : setNewProduct({ ...newProduct, category: value })
                }
                options={existingCategories}
                placeholder="Seleccionar o crear categoría"
              />
            </div>
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                placeholder="45000"
                value={editingId ? editData.price : newProduct.price}
                onChange={(e) => editingId
                  ? setEditData({ ...editData, price: e.target.value })
                  : setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="10"
                value={editingId ? editData.stock : newProduct.stock}
                onChange={(e) => editingId
                  ? setEditData({ ...editData, stock: e.target.value })
                  : setNewProduct({ ...newProduct, stock: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="minStock">Stock Mínimo</Label>
              <Input
                id="minStock"
                type="number"
                placeholder="5"
                value={editingId ? editData.minStock : newProduct.minStock}
                onChange={(e) => editingId
                  ? setEditData({ ...editData, minStock: e.target.value })
                  : setNewProduct({ ...newProduct, minStock: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {editingId ? (
              <>
                <Button onClick={saveEdit}>
                  <FaShoppingCart className="mr-2 h-4 w-4" /> Guardar Cambios
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={handleAddProduct}>
                <FaPlus className="mr-2 h-4 w-4" /> Agregar Producto
              </Button>
            )}
          </div>

          {showSuccess && (
            <Alert className="mt-4 border-green-500 bg-green-50">
              <FaShoppingCart className="h-4 w-4" />
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>Producto guardado correctamente.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-primary">Lista de Productos e Inventario</CardTitle>
          <CardDescription>Productos disponibles con control de stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  product.stock <= product.minStock 
                    ? "border-red-300 bg-red-50" 
                    : "border-primary/10 hover:bg-primary/5"
                }`}
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Material: {product.material} | Categoría: {product.category}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-primary">${product.price.toLocaleString()}</p>
                    <p className={`text-sm ${product.stock <= product.minStock ? "text-red-500 font-bold" : ""}`}>
                      Stock: {product.stock} (Min: {product.minStock})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => startEdit(product)}>
                      <FaPen className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará "{product.name}" del inventario.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteProduct(product.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
