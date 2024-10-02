import { AppSidebar } from "~/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Copy } from "lucide-react"
import { useLoaderData } from "@remix-run/react"
import { LoaderFunction, json } from "@remix-run/node"
import axios from "axios"
import { useToast } from "~/hooks/use-toast"

type Rates = {
  dolarParalelo: number | null
  dolarBCV: number | null
  dolarBinance: number | null
}

export const loader: LoaderFunction = async () => {
  try {
    const [paralelo, bcv, binance] = await Promise.all([
      axios.get("https://pydolarve.org/api/v1/dollar?monitor=enparalelovzla"),
      axios.get("https://ve.dolarapi.com/v1/dolares/oficial"),
      axios.get("https://pydolarve.org/api/v1/dollar?monitor=binance")
    ])


    const rates: Rates = {
      dolarParalelo: paralelo.data.price,
      dolarBCV: bcv.data.promedio || null,
      dolarBinance: binance.data.price,
    }

    console.log('Rates:', rates);

    return json({ rates })
  } catch (error) {
    console.error("Error fetching rates:", error)
    return json({ rates: { dolarParalelo: null, dolarBCV: null, dolarBinance: null } })
  }
}

export default function Dashboard() {
  const { rates } = useLoaderData<{ rates: Rates }>()
  const { toast } = useToast()


  const copyToClipboard = (value: any) => {
    if (value !== null) {
      navigator.clipboard.writeText(value.toString()).then(() => {
        toast({
          title: "Valor copiado",
          description: `${value.toFixed(2)} ha sido copiado al portapapeles.`,
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

  const cardColors = {
    dolarParalelo: "bg-[#FFF8E1] border-[#FFE0B2] text-[#795548]",
    dolarBCV: "bg-[#FFFDE7] border-[#FFF9C4] text-[#827717]",
    dolarBinance: "bg-[#FFF3E0] border-[#FFE0B2] text-[#BF360C]",
  }

  return (
    <SidebarLayout defaultOpen={false}>
      <AppSidebar />
      <main className="flex flex-1 flex-col p-4 transition-all duration-300 ease-in-out bg-background">
        <div className="h-full rounded-md border-2 border-border p-4">
          <SidebarTrigger />
          <div className="flex flex-col space-y-4 max-w-[300px] mx-auto lg:max-w-none lg:flex-row lg:space-y-0 lg:space-x-4 lg:justify-center">
            {Object.entries(rates).map(([key, value]) => (
              <Card key={key} className={`w-full aspect-square lg:w-[300px] shadow-lg hover:shadow-xl transition-shadow duration-300 ${cardColors[key as keyof typeof cardColors]} border-2`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold">
                    {key === "dolarParalelo" ? "Dólar Paralelo" :
                     key === "dolarBCV" ? "Dólar BCV" : "Dólar Binance"}
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
                    {value !== null ? value.toFixed(2) : "N/A"}
                  </div>
                  <div className="text-lg opacity-80">
                    {value !== null ? "Bsd" : ""}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </SidebarLayout>
  )
}