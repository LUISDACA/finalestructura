import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { FacturasTable } from "@/components/facturas-table"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function FacturasPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Facturas</h2>
          <p className="text-muted-foreground">Gestiona todas tus facturas en un solo lugar</p>
        </div>
        <Button asChild>
          <Link href="/facturas/nueva">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Link>
        </Button>
      </div>

      <Separator />

      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="pagadas">Pagadas</TabsTrigger>
          <TabsTrigger value="vencidas">Vencidas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Facturas</CardTitle>
              <CardDescription>Visualiza y gestiona todas tus facturas</CardDescription>
            </CardHeader>
            <CardContent>
              <FacturasTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendientes">
          <Card>
            <CardHeader>
              <CardTitle>Facturas Pendientes</CardTitle>
              <CardDescription>Facturas emitidas pendientes de pago</CardDescription>
            </CardHeader>
            <CardContent>
              <FacturasTable estado="pendiente" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagadas">
          <Card>
            <CardHeader>
              <CardTitle>Facturas Pagadas</CardTitle>
              <CardDescription>Facturas que ya han sido pagadas</CardDescription>
            </CardHeader>
            <CardContent>
              <FacturasTable estado="pagada" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vencidas">
          <Card>
            <CardHeader>
              <CardTitle>Facturas Vencidas</CardTitle>
              <CardDescription>Facturas con fecha de pago vencida</CardDescription>
            </CardHeader>
            <CardContent>
              <FacturasTable estado="vencida" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
