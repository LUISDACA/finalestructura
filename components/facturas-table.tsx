"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, MoreHorizontal, CheckCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { generarFacturaPDF } from "@/lib/pdf-generator"
import { useApp } from "@/lib/app-context"

interface FacturasTableProps {
  estado?: "pendiente" | "pagada" | "vencida"
}

export function FacturasTable({ estado }: FacturasTableProps) {
  const { state, marcarFacturaComoPagada } = useApp()

  // Filtrar facturas según el estado si se proporciona
  const facturas = estado ? state.facturas.filter((factura) => factura.estado === estado) : state.facturas

  const handleDescargarPDF = async (factura: any) => {
    try {
      // Buscar el cliente en el estado global
      const clienteEncontrado = state.clientes.find((c) => c.nombre === factura.cliente)

      if (!clienteEncontrado) {
        toast({
          title: "Error",
          description: "Cliente no encontrado",
          variant: "destructive",
        })
        return
      }

      // Calcular totales
      const subtotal = factura.items.reduce((sum: number, item: any) => sum + item.importe, 0)
      const iva = subtotal * 0.16
      const total = subtotal + iva

      // Preparar datos para el PDF
      const datosFactura = {
        numero: factura.id,
        fecha: new Date(factura.fecha),
        cliente: {
          nombre: clienteEncontrado.nombre,
          email: clienteEncontrado.email,
          telefono: clienteEncontrado.telefono,
          direccion: clienteEncontrado.ubicacion,
        },
        items: factura.items,
        subtotal,
        iva,
        total,
        notas: "Gracias por su preferencia. Pago a 30 días.",
        empresa: {
          nombre: "Fac S.A. de C.V.",
          rfc: "FPR123456789",
          direccion: "Av. Tecnológico 123, Ciudad de México",
          telefono: "+52 55 1234 5678",
          email: "contacto@facturapro.com",
        },
      }

      // Generar y descargar el PDF
      await generarFacturaPDF(datosFactura)

      toast({
        title: "PDF descargado",
        description: `La factura ${factura.id} se ha descargado correctamente`,
      })
    } catch (error) {
      console.error("Error al descargar PDF:", error)
      toast({
        title: "Error",
        description: "Hubo un error al generar el PDF",
        variant: "destructive",
      })
    }
  }

  const handleMarcarComoPagada = (id: string) => {
    marcarFacturaComoPagada(id)
    toast({
      title: "Factura actualizada",
      description: "La factura ha sido marcada como pagada",
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Factura</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha Emisión</TableHead>
          <TableHead>Fecha Vencimiento</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facturas.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No hay facturas para mostrar
            </TableCell>
          </TableRow>
        ) : (
          facturas.map((factura) => (
            <TableRow key={factura.id}>
              <TableCell className="font-medium">{factura.id}</TableCell>
              <TableCell>{factura.cliente}</TableCell>
              <TableCell>{factura.fecha}</TableCell>
              <TableCell>{factura.vencimiento}</TableCell>
              <TableCell>{factura.monto}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    factura.estado === "pagada" ? "success" : factura.estado === "pendiente" ? "outline" : "destructive"
                  }
                >
                  {factura.estado.toUpperCase()}
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
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDescargarPDF(factura)}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </DropdownMenuItem>
                    {factura.estado === "pendiente" && (
                      <DropdownMenuItem onClick={() => handleMarcarComoPagada(factura.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Marcar como pagada
                      </DropdownMenuItem>
                    )}
                    {factura.estado === "vencida" && <DropdownMenuItem>Enviar recordatorio</DropdownMenuItem>}
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
