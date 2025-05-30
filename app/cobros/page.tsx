"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { CobrosTable } from "@/components/cobros-table"
import { NuevoCobroDialog } from "@/components/nuevo-cobro-dialog"
import { Plus } from "lucide-react"

export default function CobrosPage() {
  const [isNuevoCobroOpen, setIsNuevoCobroOpen] = useState(false)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cobros</h2>
          <p className="text-muted-foreground">Gestiona los cobros de tus facturas</p>
        </div>
        <Button onClick={() => setIsNuevoCobroOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Programar Cobro
        </Button>
      </div>

      <Separator />

      <Tabs defaultValue="pendientes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="procesados">Procesados</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes">
          <Card>
            <CardHeader>
              <CardTitle>Cobros Pendientes</CardTitle>
              <CardDescription>Cobros programados pendientes de procesamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <CobrosTable estado="pendiente" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procesados">
          <Card>
            <CardHeader>
              <CardTitle>Cobros Procesados</CardTitle>
              <CardDescription>Cobros que ya han sido procesados</CardDescription>
            </CardHeader>
            <CardContent>
              <CobrosTable estado="procesado" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Cobros</CardTitle>
              <CardDescription>Visualiza todos los cobros</CardDescription>
            </CardHeader>
            <CardContent>
              <CobrosTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NuevoCobroDialog open={isNuevoCobroOpen} onOpenChange={setIsNuevoCobroOpen} />
    </div>
  )
}
