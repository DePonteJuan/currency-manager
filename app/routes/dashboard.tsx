import { AppSidebar } from "~/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "~/components/ui/sidebar"
// import { useLoaderData } from "@remix-run/react"
//import { LoaderFunction, json } from "@remix-run/node"
//import { getSession } from "~/sessions"

//export const loader: LoaderFunction = async ({ request }) => {
//  const session = await getSession(request.headers.get("Cookie"))
 // const sidebarState = session.get("sidebar:state")
  //return json({ defaultOpen: sidebarState === "true" })
//}

export default function Dashboard() {
  //const { defaultOpen } = useLoaderData<typeof loader>()

  return (
    <SidebarLayout defaultOpen={false}>
      <AppSidebar />
      <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
        <div className="h-full rounded-md border-2 border-dashed p-2">
          <SidebarTrigger />
        <h1>Dashboard</h1>
        </div>
      </main>
    </SidebarLayout>
  )
}
