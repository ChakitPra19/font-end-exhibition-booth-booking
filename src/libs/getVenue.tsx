export default async function getVenue(id:string){
    const response = await fetch(`https://a08-venue-explorer-backend.vercel.app/api/v1/venues/${id}`)
    if(!response.ok){
        throw new Error("Failed to fetch")
    }
    return await response.json()
}