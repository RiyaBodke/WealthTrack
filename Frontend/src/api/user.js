export async function getProfile(){
    
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:8000/api/profile",{
            
        headers : 
        {
            Authorization : `Bearer ${token}`
        }
    });

    return await response.json();
    
}