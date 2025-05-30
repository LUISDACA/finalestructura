"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { useApp } from "@/lib/app-context"

interface NuevoCobroDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NuevoCobroDialog({ open, onOpenChange }: NuevoCobroDialogProps) {
  const { state, agregarCobro } = useApp()
  const [formData, setFormData] = useState({
    factura: "",
    fechaProgramada: undefined as Date | undefined,
    metodoCobro: "",
    referencia: "",
  })

  // Obtener facturas pendientes
  const facturasPendientes = state.facturas.filter((f) => f.estado === "pendiente")

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.factura || !formData.fechaProgramada || !formData.metodoCobro) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Obtener datos de la factura seleccionada
    const facturaSeleccionada = state.facturas.find((f) => f.id === formData.factura)
    if (!facturaSeleccionada) {
      toast({
        title: "Error",
        description: "Factura no encontrada",
        variant: "destructive",
      })
      return
    }

    // Extraer el monto numérico de la factura
    const montoString = facturaSeleccionada.monto.replace(/[$,]/g, "")
    const monto = Number.parseFloat(montoString)

    // Agregar el cobro
    agregarCobro({
      factura: formData.factura,
      cliente: facturaSeleccionada.cliente,
      monto: monto,
      fecha_programada: format(formData.fechaProgramada, "yyyy-MM-dd"),
      fecha_procesamiento: null,
      estado: "pendiente",
      metodo: formData.metodoCobro,
      referencia: formData.referencia,
    })

    toast({
      title: "Cobro programado",
      description: "El cobro ha sido programado correctamente",
    })

    // Limpiar formulario y cerrar
    setFormData({
      factura: "",
      fechaProgramada: undefined,
      metodoCobro: "",
      referencia: "",
    })
    onOpenChange(false)
  }

  const facturaSeleccionada = facturasPendientes.find((f) => f.id === formData.factura)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Programar Nuevo Cobro</DialogTitle>
            <DialogDescription>Programa un cobro para una factura pendiente</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="factura" className="text-right">
                Factura *
              </Label>
              <Select value={formData.factura} onValueChange={(value) => handleChange("factura", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar factura" />
                </SelectTrigger>
                <SelectContent>
                  {facturasPendientes.map((factura) => (
                    <SelectItem key={factura.id} value={factura.id}>
                      {factura.id} - {factura.cliente} ({factura.monto})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {facturaSeleccionada && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Monto</Label>
                <div className="col-span-3 text-lg font-semibold">{facturaSeleccionada.monto}</div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fecha *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !formData.fechaProgramada && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fechaProgramada
                      ? format(formData.fechaProgramada, "PPP", { locale: es })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fechaProgramada}
                    onSelect={(date) => handleChange("fechaProgramada", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metodo" className="text-right">
                Método *
              </Label>
              <Select value={formData.metodoCobro} onValueChange={(value) => handleChange("metodoCobro", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Método de cobro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="referencia" className="text-right">
                Referencia
              </Label>
              <Input
                id="referencia"
                value={formData.referencia}
                onChange={(e) => handleChange("referencia", e.target.value)}
                className="col-span-3"
                placeholder="Número de referencia (opcional)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Programar Cobro</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
