import { useLoaderData } from "@remix-run/react"
import { LoaderFunction, json } from "@remix-run/node"
import axios from "axios"
import { CurrencyConverter } from "~/components/currencyConverter"
import { SidebarLayout, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar"

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

export default function Calculator() {
  const { rates } = useLoaderData<{ rates: Rates }>()

  return (
  
  
    <SidebarLayout defaultOpen={false}>
      <AppSidebar />
      <main className="flex flex-1 flex-col p-4 transition-all duration-300 ease-in-out bg-background">
        <div className="h-full rounded-md  p-4">
          <SidebarTrigger />
          <div className="flex flex-col space-y-4 max-w-[300px] mx-auto lg:max-w-none lg:flex-row lg:space-y-0 lg:space-x-4 lg:justify-center">
            <CurrencyConverter rates={rates} />
          </div>
        </div>
      </main>
    </SidebarLayout>
  )
}
