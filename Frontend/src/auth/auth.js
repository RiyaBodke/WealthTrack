// Function to fetch the token
export function getToken(){

    return sessionStorage.getItem("token");

}

// Function to check if the user is logged in
export function isLoggedIn(){
    
    return getToken() !== null;

}
