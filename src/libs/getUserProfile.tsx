// Legacy function - use getCurrentUser from authAPI.tsx for new implementations
export default async function getUserProfile(token:string){
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

    const response = await fetch(`${API_BASE_URL}/auth/me`,{
        method: "GET",
        headers:{
            authorization: `Bearer ${token}`,
        }
    })

    if(!response.ok){
        throw new Error("Cannot get user profile")
    }

    return await response.json()
}