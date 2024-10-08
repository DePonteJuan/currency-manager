import { AppSidebar } from "~/components/app-sidebar"
import { SidebarLayout, SidebarTrigger } from "~/components/ui/sidebar"
import { useLoaderData } from "@remix-run/react"
import { LoaderFunction, json } from "@remix-run/node"
import axios from "axios"
import { CurrencyConverter } from "~/components/currencyConverter"
import { ExchangeRateCard } from "~/components/ExchangeRateCards"

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

  const cardColors = {
    dolarParalelo: "bg-[#FFF8E1] border-[#FFE0B2] text-[#795548]",
    dolarBCV: "bg-[#FFFDE7] border-[#FFF9C4] text-[#827717]",
    dolarBinance: "bg-[#FFF3E0] border-[#FFE0B2] text-[#BF360C]",
  }

  return (
    <SidebarLayout defaultOpen={false}>
      <AppSidebar />
      <main className="flex flex-1 flex-col p-4 transition-all duration-300 ease-in-out bg-background">
        <div className="h-full rounded-md  p-4">
          <SidebarTrigger />
          <div className="flex flex-col space-y-4 max-w-[300px] mx-auto lg:max-w-none lg:flex-row lg:space-y-0 lg:space-x-4 lg:justify-center">
            <ExchangeRateCard
              title="Dólar Paralelo"
              value={rates.dolarParalelo}
              colorClass={cardColors.dolarParalelo}
              currency="VES"
            />
            <ExchangeRateCard
              title="Dólar BCV"
              value={rates.dolarBCV}
              colorClass={cardColors.dolarBCV}
              currency="VES"
            />
            <ExchangeRateCard
              title="Dólar Binance"
              value={rates.dolarBinance}
              colorClass={cardColors.dolarBinance}
              currency="VES"
            />
          </div>
          <CurrencyConverter rates={rates} />
        </div>
      </main>
    </SidebarLayout>
  )
}