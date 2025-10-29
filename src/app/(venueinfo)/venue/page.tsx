import getVenues from "@/libs/getVenues"
import VenueCatalog from "@/components/VenueCatalog"

export default async function Venue() {
    const venues = await getVenues()

    return (
        <main className="text-center p-5">
            <h1 className="text-xl font-medium">Select Your Venue</h1>
            <VenueCatalog venuesJson={venues}/>
        </main>
    )
}