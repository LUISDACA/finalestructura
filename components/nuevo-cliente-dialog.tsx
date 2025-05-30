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
import { toast } from "@/components/ui/use-toast"
import { useApp } from "@/lib/app-context"

interface NuevoClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NuevoClienteDialog({ open, onOpenChange }: NuevoClienteDialogProps) {
  const { agregarCliente } = useApp()
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    email: "",
    telefono: "",
    ubicacion: "",
    pais: "MX",
  })

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

    // Agregar el cliente
    agregarCliente({
      nombre: formData.nombre,
      contacto: formData.contacto,
      email: formData.email,
      telefono: formData.telefono,
      ubicacion: formData.ubicacion,
      estado: "activo",
    })

    toast({
      title: "Cliente creado",
      description: "El cliente ha sido creado correctamente",
    })

    // Limpiar formulario y cerrar diálogo
    setFormData({
      nombre: "",
      contacto: "",
      email: "",
      telefono: "",
      ubicacion: "",
      pais: "MX",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
            <DialogDescription>Completa la información para crear un nuevo cliente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Nombre de la empresa o cliente"
              />
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
                placeholder="Nombre de la persona de contacto"
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
                placeholder="correo@ejemplo.com"
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
                placeholder="+52 55 1234 5678"
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
                placeholder="Ciudad, Estado"
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
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
