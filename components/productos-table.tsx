"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Check, X, Edit, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useApp } from "@/lib/app-context"

interface ProductosTableProps {
  searchTerm?: string
  onEdit?: (producto: any) => void
}

export function ProductosTable({ searchTerm = "", onEdit }: ProductosTableProps) {
  const { state, cambiarEstadoProducto, eliminarProducto } = useApp()
  const [filteredProductos, setFilteredProductos] = useState(state.productos)

  // Filtrar productos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProductos(state.productos)
    } else {
      const termino = searchTerm.toLowerCase()
      const filtered = state.productos.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(termino) ||
          producto.descripcion.toLowerCase().includes(termino) ||
          producto.tipo.toLowerCase().includes(termino),
      )
      setFilteredProductos(filtered)
    }
  }, [searchTerm, state.productos])

  // Cambiar estado de un producto
  const handleCambiarEstado = (id: string) => {
    const producto = state.productos.find((p) => p.id === id)
    cambiarEstadoProducto(id)
    toast({
      title: "Estado actualizado",
      description: `El producto ha sido ${producto?.estado === "activo" ? "desactivado" : "activado"}.`,
    })
  }

  // Eliminar un producto
  const handleEliminarProducto = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      eliminarProducto(id)
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente.",
      })
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProductos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No se encontraron productos que coincidan con la búsqueda
            </TableCell>
          </TableRow>
        ) : (
          filteredProductos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell className="font-medium">{producto.nombre}</TableCell>
              <TableCell>{producto.descripcion}</TableCell>
              <TableCell>${producto.precio.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="secondary">{producto.tipo.toUpperCase()}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={producto.estado === "activo" ? "success" : "outline"}>
                  {producto.estado.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit && onEdit(producto)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar producto
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCambiarEstado(producto.id)}>
                      {producto.estado === "activo" ? (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Activar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleEliminarProducto(producto.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
