// Legacy function - use loginUser from authAPI.tsx for new implementations
export default async function userLogin(userEmail:string, userPassword:string) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';
    
    const response = await fetch(`${API_BASE_URL}/auth/login`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPassword
        }),
    })
    if(!response.ok){
        throw new Error("Failed to log-in")
    }

    return await response.json()
}