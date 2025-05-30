"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { toast } from "@/components/ui/use-toast"
import { useApp } from "@/lib/app-context"

interface EditarClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente: any
}

export function EditarClienteDialog({ open, onOpenChange, cliente }: EditarClienteDialogProps) {
  const { actualizarCliente } = useApp()
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    email: "",
    telefono: "",
    ubicacion: "",
    pais: "MX",
  })

  // Cargar datos del cliente cuando cambia
  useEffect(() => {
    if (cliente) {
      // Extraer el país de la ubicación (simplificado)
      let pais = "MX"
      if (cliente.ubicacion.includes("España")) pais = "ES"
      if (cliente.ubicacion.includes("Colombia")) pais = "CO"
      if (cliente.ubicacion.includes("Argentina")) pais = "AR"

      setFormData({
        nombre: cliente.nombre || "",
        contacto: cliente.contacto || "",
        email: cliente.email || "",
        telefono: cliente.telefono || "",
        ubicacion: cliente.ubicacion || "",
        pais,
      })
    }
  }, [cliente])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del cliente es obligatorio",
        variant: "destructive",
      })
      return
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast({
        title: "Error",
        description: "El email no es válido",
        variant: "destructive",
      })
      return
    }

    // Actualizar el cliente
    actualizarCliente(cliente.id, {
      nombre: formData.nombre,
      contacto: formData.contacto,
      email: formData.email,
      telefono: formData.telefono,
      ubicacion: formData.ubicacion,
    })

    toast({
      title: "Cliente actualizado",
      description: "El cliente ha sido actualizado correctamente",
    })

    // Cerrar diálogo
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Actualiza la información del cliente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contacto" className="text-right">
                Contacto
              </Label>
              <Input
                id="contacto"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ubicacion" className="text-right">
                Ubicación
              </Label>
              <Input
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pais" className="text-right">
                País
              </Label>
              <Select value={formData.pais} onValueChange={(value) => handleSelectChange("pais", value)}>
                <SelectTrigger id="pais" className="col-span-3">
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MX">México</SelectItem>
                  <SelectItem value="ES">España</SelectItem>
                  <SelectItem value="CO">Colombia</SelectItem>
                  <SelectItem value="AR">Argentina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
