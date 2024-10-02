import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "~/hooks/use-toast"

interface ExchangeRateCardProps {
  title: string
  value: number | null
  colorClass: string
  currency: 'USD' | 'VES'
}

export function ExchangeRateCard({ title, value, colorClass, currency }: ExchangeRateCardProps) {
  const { toast } = useToast()

  const copyToClipboard = (value: number | null) => {
    if (value !== null) {
      const formattedValue = currency === 'USD' ? `$${value.toFixed(2)}` : `Bs. ${value.toFixed(2)}`;
      navigator.clipboard.writeText(formattedValue).then(() => {
        toast({
          title: "Valor copiado",
          description: `${formattedValue} ha sido copiado al portapapeles.`,
          duration: 3000,
        })
      }).catch((error) => {
        console.error("Error al copiar al portapapeles:", error)
        toast({
          title: "Error",
          description: "No se pudo copiar el valor al portapapeles.",
          variant: "destructive",
          duration: 3000,
        })
      })
    } else {
      console.error("Valor no válido para copiar al portapapeles")
      toast({
        title: "Error",
        description: "No hay un valor válido para copiar.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <Card className={`w-full aspect-square lg:w-[300px] shadow-lg hover:shadow-xl transition-shadow duration-300 ${colorClass} border-2`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          {title}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(value)}
          disabled={value === null}
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[calc(100%-4rem)] p-6">
        <div className="text-4xl font-bold mb-2">
          {value !== null ? (currency === 'USD' ? '$' : 'Bs. ') + value.toFixed(2) : "N/A"}
        </div>
        <div className="text-lg opacity-80">
          {currency === 'USD' ? 'USD' : 'VES'}
        </div>
      </CardContent>
    </Card>
  )
}
