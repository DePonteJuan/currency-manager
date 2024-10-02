import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Button } from "~/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "~/hooks/use-toast"

type Rates = {
  dolarParalelo: number | null
  dolarBCV: number | null
  dolarBinance: number | null
}

interface CurrencyConverterProps {
  rates: Rates
}

export function CurrencyConverter({ rates }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>('')
  const [selectedRate, setSelectedRate] = useState<keyof Rates>('dolarParalelo')
  const [convertFrom, setConvertFrom] = useState<'VES' | 'USD'>('VES')
  const { toast } = useToast()

  const handleConvert = () => {
    const inputAmount = parseFloat(amount)
    if (isNaN(inputAmount) || rates[selectedRate] === null) return '0.00'

    if (convertFrom === 'VES') {
      return (inputAmount / rates[selectedRate]!).toFixed(2)
    } else {
      return (inputAmount * rates[selectedRate]!).toFixed(2)
    }
  }

  const copyToClipboard = (value: string) => {
    const formattedValue = convertFrom === 'VES' ? `$${value}` : `Bs. ${value}`;
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
  }

  const cardColors = {
    dolarParalelo: "bg-[#FFF8E1] border-[#FFE0B2] text-[#795548]",
    dolarBCV: "bg-[#FFFDE7] border-[#FFF9C4] text-[#827717]",
    dolarBinance: "bg-[#FFF3E0] border-[#FFE0B2] text-[#BF360C]",
  }

  return (
    <Card className={`w-full max-w-md mx-auto mt-8 ${cardColors[selectedRate]} border-2 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Convertidor de Divisas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Cantidad"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-grow bg-white/50"
          />
          <Select value={convertFrom} onValueChange={(value: 'VES' | 'USD') => setConvertFrom(value)}>
            <SelectTrigger className="w-[100px] bg-white/50">
              <SelectValue placeholder="Moneda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VES">VES</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={selectedRate} onValueChange={(value: keyof Rates) => setSelectedRate(value)}>
          <SelectTrigger className="bg-white/50">
            <SelectValue placeholder="Seleccionar tasa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dolarParalelo">Dólar Paralelo</SelectItem>
            <SelectItem value="dolarBCV">Dólar BCV</SelectItem>
            <SelectItem value="dolarBinance">Dólar Binance</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-center p-4 bg-white/30 rounded-lg">
          <p className="text-lg font-semibold">
            {amount || '0'} {convertFrom} =
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <p className="text-3xl font-bold">
              {handleConvert()} {convertFrom === 'VES' ? 'USD' : 'VES'}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(handleConvert())}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button 
          onClick={() => setConvertFrom(convertFrom === 'VES' ? 'USD' : 'VES')} 
          className="w-full bg-white/50 hover:bg-white/70 text-black"
        >
          Invertir conversión
        </Button>
      </CardContent>
    </Card>
  )
}