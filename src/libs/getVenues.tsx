export default async function getVenues(){
    const response = await fetch("https://a08-venue-explorer-backend.vercel.app/api/v1/venues")
    if(!response.ok){
        throw new Error("Failed to fetch")
    }
    return await response.json()
}