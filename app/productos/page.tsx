"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Plus, Search } from "lucide-react"
import { ProductosTable } from "@/components/productos-table"
import { NuevoProductoDialog } from "@/components/nuevo-producto-dialog"
import { EditarProductoDialog } from "@/components/editar-producto-dialog"

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isNuevoDialogOpen, setIsNuevoDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [productoActual, setProductoActual] = useState<any>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleEdit = (producto: any) => {
    setProductoActual(producto)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Productos y Servicios</h2>
          <p className="text-muted-foreground">Gestiona tu catálogo de productos y servicios</p>
        </div>
        <Button onClick={() => setIsNuevoDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Separator />

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos</CardTitle>
          <CardDescription>Visualiza y gestiona todos tus productos y servicios</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductosTable searchTerm={searchTerm} onEdit={handleEdit} />
        </CardContent>
      </Card>

      <NuevoProductoDialog open={isNuevoDialogOpen} onOpenChange={setIsNuevoDialogOpen} />

      {productoActual && (
        <EditarProductoDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} producto={productoActual} />
      )}
    </div>
  )
}
