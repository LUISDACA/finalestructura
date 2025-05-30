import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function ConfiguracionPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Gestiona la configuración de tu sistema de facturación</p>
      </div>

      <Separator />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="facturacion">Facturación</TabsTrigger>
          <TabsTrigger value="impuestos">Impuestos</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
              <CardDescription>Configura la información de tu empresa para las facturas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre-empresa">Nombre de la Empresa</Label>
                  <Input id="nombre-empresa" placeholder="Tu Empresa S.A. de C.V." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfc">RFC / Identificación Fiscal</Label>
                  <Input id="rfc" placeholder="XXX010101XXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" placeholder="Calle, Número, Colonia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" placeholder="Ciudad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado / Provincia</Label>
                  <Input id="estado" placeholder="Estado" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Select defaultValue="MX">
                    <SelectTrigger id="pais">
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
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" placeholder="+52 55 1234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contacto@tuempresa.com" />
                </div>
              </div>
              <Button className="mt-4">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facturacion">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Facturación</CardTitle>
              <CardDescription>Personaliza la configuración de tus facturas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serie">Serie de Facturación</Label>
                  <Input id="serie" placeholder="FACT" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="folio-inicial">Folio Inicial</Label>
                  <Input id="folio-inicial" type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moneda">Moneda Predeterminada</Label>
                  <Select defaultValue="MXN">
                    <SelectTrigger id="moneda">
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                      <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dias-vencimiento">Días para Vencimiento</Label>
                  <Input id="dias-vencimiento" type="number" placeholder="30" />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-recordatorios">Enviar recordatorios automáticos</Label>
                  <Switch id="auto-recordatorios" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-cobros">Programar cobros automáticos</Label>
                  <Switch id="auto-cobros" />
                </div>
              </div>
              <Button className="mt-4">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impuestos">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Impuestos</CardTitle>
              <CardDescription>Configura los impuestos aplicables a tus facturas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="impuesto-default">Impuesto Predeterminado</Label>
                  <Select defaultValue="16">
                    <SelectTrigger id="impuesto-default">
                      <SelectValue placeholder="Seleccionar impuesto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16">IVA 16%</SelectItem>
                      <SelectItem value="8">IVA 8% (Frontera)</SelectItem>
                      <SelectItem value="0">Exento de IVA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retencion-isr">Retención ISR</Label>
                  <Select defaultValue="10">
                    <SelectTrigger id="retencion-isr">
                      <SelectValue placeholder="Seleccionar retención" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="0">No aplicar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retencion-iva">Retención IVA</Label>
                  <Select defaultValue="0">
                    <SelectTrigger id="retencion-iva">
                      <SelectValue placeholder="Seleccionar retención" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10.67">10.67% (2/3 del IVA)</SelectItem>
                      <SelectItem value="0">No aplicar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="mt-4">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>Configura las notificaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-facturas">Notificaciones de facturas</Label>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones cuando se generen facturas</p>
                  </div>
                  <Switch id="email-facturas" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-cobros">Notificaciones de cobros</Label>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones cuando se procesen cobros</p>
                  </div>
                  <Switch id="email-cobros" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-vencimientos">Alertas de vencimiento</Label>
                    <p className="text-sm text-muted-foreground">Recibe alertas cuando las facturas estén por vencer</p>
                  </div>
                  <Switch id="email-vencimientos" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-clientes">Notificaciones de clientes</Label>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones sobre nuevos clientes</p>
                  </div>
                  <Switch id="email-clientes" />
                </div>
              </div>
              <Button className="mt-4">Guardar Preferencias</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
