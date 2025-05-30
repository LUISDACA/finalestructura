"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, CheckCircle, Clock, AlertCircle } from "lucide-react"
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

interface CobrosTableProps {
  estado?: "pendiente" | "procesado"
}

export function CobrosTable({ estado }: CobrosTableProps) {
  const { state, marcarCobroComoProcesado } = useApp()

  // Filtrar cobros según el estado si se proporciona
  const cobrosFiltrados = estado ? state.cobros.filter((cobro) => cobro.estado === estado) : state.cobros

  const handleMarcarComoProcesado = (id: string) => {
    marcarCobroComoProcesado(id)
    toast({
      title: "Cobro procesado",
      description: "El cobro ha sido marcado como procesado",
    })
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "procesado":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pendiente":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Factura</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Fecha Programada</TableHead>
          <TableHead>Fecha Procesamiento</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cobrosFiltrados.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
              No hay cobros para mostrar
            </TableCell>
          </TableRow>
        ) : (
          cobrosFiltrados.map((cobro) => (
            <TableRow key={cobro.id}>
              <TableCell className="font-medium">{cobro.id}</TableCell>
              <TableCell>{cobro.factura}</TableCell>
              <TableCell>{cobro.cliente}</TableCell>
              <TableCell>${cobro.monto.toLocaleString()}</TableCell>
              <TableCell>{cobro.fecha_programada}</TableCell>
              <TableCell>{cobro.fecha_procesamiento || "-"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getEstadoIcon(cobro.estado)}
                  <Badge variant={cobro.estado === "procesado" ? "success" : "outline"}>
                    {cobro.estado.toUpperCase()}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{cobro.metodo}</TableCell>
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
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Ver factura</DropdownMenuItem>
                    {cobro.estado === "pendiente" && (
                      <DropdownMenuItem onClick={() => handleMarcarComoProcesado(cobro.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Marcar como procesado
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Cancelar cobro</DropdownMenuItem>
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
