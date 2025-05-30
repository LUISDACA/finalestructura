"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Mail, Phone, Check, X, Edit, Trash } from "lucide-react"
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

interface ClientesTableProps {
  searchTerm?: string
  onEdit?: (cliente: any) => void
}

export function ClientesTable({ searchTerm = "", onEdit }: ClientesTableProps) {
  const { state, cambiarEstadoCliente, eliminarCliente } = useApp()
  const [filteredClientes, setFilteredClientes] = useState(state.clientes)

  // Filtrar clientes cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClientes(state.clientes)
    } else {
      const termino = searchTerm.toLowerCase()
      const filtered = state.clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(termino) ||
          cliente.contacto.toLowerCase().includes(termino) ||
          cliente.email.toLowerCase().includes(termino) ||
          cliente.ubicacion.toLowerCase().includes(termino),
      )
      setFilteredClientes(filtered)
    }
  }, [searchTerm, state.clientes])

  // Cambiar estado de un cliente
  const handleCambiarEstado = (id: string) => {
    const cliente = state.clientes.find((c) => c.id === id)
    cambiarEstadoCliente(id)
    toast({
      title: "Estado actualizado",
      description: `El cliente ha sido ${cliente?.estado === "activo" ? "desactivado" : "activado"}.`,
    })
  }

  // Eliminar un cliente
  const handleEliminarCliente = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      eliminarCliente(id)
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado correctamente.",
      })
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Facturas</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredClientes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              No se encontraron clientes que coincidan con la búsqueda
            </TableCell>
          </TableRow>
        ) : (
          filteredClientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.nombre}</TableCell>
              <TableCell>{cliente.contacto}</TableCell>
              <TableCell>
                <a href={`mailto:${cliente.email}`} className="flex items-center gap-1 text-primary hover:underline">
                  <Mail className="h-3 w-3" />
                  {cliente.email}
                </a>
              </TableCell>
              <TableCell>
                <a href={`tel:${cliente.telefono}`} className="flex items-center gap-1 hover:underline">
                  <Phone className="h-3 w-3" />
                  {cliente.telefono}
                </a>
              </TableCell>
              <TableCell>{cliente.ubicacion}</TableCell>
              <TableCell>
                <Badge variant={cliente.estado === "activo" ? "success" : "outline"}>
                  {cliente.estado.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{cliente.facturas}</TableCell>
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
                    <DropdownMenuItem onClick={() => onEdit && onEdit(cliente)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar cliente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCambiarEstado(cliente.id)}>
                      {cliente.estado === "activo" ? (
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
                    <DropdownMenuItem className="text-destructive" onClick={() => handleEliminarCliente(cliente.id)}>
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
