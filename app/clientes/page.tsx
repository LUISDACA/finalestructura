"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Plus, Search } from "lucide-react"
import { ClientesTable } from "@/components/clientes-table"
import { NuevoClienteDialog } from "@/components/nuevo-cliente-dialog"
import { EditarClienteDialog } from "@/components/editar-cliente-dialog"

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isNuevoDialogOpen, setIsNuevoDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [clienteActual, setClienteActual] = useState<any>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleEdit = (cliente: any) => {
    setClienteActual(cliente)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">Gestiona tu cartera de clientes</p>
        </div>
        <Button onClick={() => setIsNuevoDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <Separator />

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Clientes</CardTitle>
          <CardDescription>Visualiza y gestiona todos tus clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientesTable searchTerm={searchTerm} onEdit={handleEdit} />
        </CardContent>
      </Card>

      <NuevoClienteDialog open={isNuevoDialogOpen} onOpenChange={setIsNuevoDialogOpen} />

      {clienteActual && (
        <EditarClienteDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} cliente={clienteActual} />
      )}
    </div>
  )
}
