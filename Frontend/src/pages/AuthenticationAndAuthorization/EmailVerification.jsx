import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

import { websiteName} from "../../data/constant"
import { useUser } from "../../context/UserContext";

// ICONS IMPORT
import { RxCross2 } from "react-icons/rx";
import { LuTriangleAlert } from "react-icons/lu";
import { BiMessageAltDetail } from "react-icons/bi";

// COMPONENTS IMPORT
import { Back, Next } from "../../components/button"

export function EmailVerification(){
    
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const { loadUser } = useUser();

    const email = sessionStorage.getItem("loginEmail");

    const navigate = useNavigate();

    useEffect(() => {                                                                   // Chrome built-in back button logic

        const step = sessionStorage.getItem("authStep");

        if(step !== "password")
            {
                navigate("/login/password", {
                    replace : true
                });
            }
    }, [navigate]);

    function navigatePassword(){                                                        // Page back button logic
        navigate("/login/password");
    }
    
    function maskEmail(email){                                                          // Function to mask email
        
        if(!email) return "";

        const [name, domain] = email.split("@");

        return(
            name.slice(0, 2) +
            "*".repeat(Math.max(name.length - 2, 0)) +
            "@" +
            domain
        )
    }

    async function handleVerify(){                                                      // Function to Next Button Logic
        if(otp.length !== 6) {
            setError("Please enter a valid 6 digit OTP");
            return;
        }

        try{
            const response = await fetch(
                
                `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,{
                
                    method : "POST",

                    headers:{
                        "Content-Type" : "application/json"
                    },

                    body: JSON.stringify({

                        email,
                        otp
                    })
                }
            );

            const data = await response.json();
            
            if(data.success){
                
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("authStep", "loggedIn");

                await loadUser();

                sessionStorage.removeItem("loginPassword");
                sessionStorage.removeItem("loginEmail");

                navigate("/portfolio/dashboard", 
                    {
                        replace: true
                    }
                );

                setOtp("");
                setError("");
            }
            else if(data.action == "LOGIN_AGAIN"){
                
                setError(data.message);

                // Cleargin Session
                sessionStorage.removeItem("loginEmail");
                sessionStorage.removeItem("loginPassword");
                sessionStorage.removeItem("authStep");

                // Navigating User back to login
                setTimeout(() => {
                        navigate("/login", {replace : true});
                    }, 5000
                );
            }
            else if(data.attemptsLeft !== undefined){

                setError(
                    `${data.message} (${data.attemptsLeft} attempts remaining)`
                );
            }
            else{
                
                setError(data.message);

            }

        }catch(error){

            setError("Something went wrong");
        }

    }
    
    return(
            <div className="min-h-screen flex items-center justify-center ">
                <div className="flex flex-col bg-white rounded-2xl w-5/12 px-10 pt-8 pb-44 gap-2 min-h-[600px]">
                
                    < Back 
                        onClick={navigatePassword}
                    />

                    <div className="flex flex-col justify-center items-center">

                        <h1 className="text-primary font-extrabold text-3xl mt-7 mb-4">{websiteName}</h1>                                              {/* Website Brand */}

                        <div className="flex flex-col justify-center items-center gap-2">                                                           {/* Enter Email Otp Prompt */}
                            
                            <h4 className="text-primary font-semibold text-2xl">We just sent an Email </h4>

                            <h4 className="text-primary font-medium ">code sent to {maskEmail(email)}</h4>

                        </div>

                        <div className="flex flex-col p-0.5 mt-3 w-11/12 gap-2">            
                            <input 
                                type="text"
                                maxLength = {6}
                                value = {otp}
                                onChange = {(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setOtp(value); 
                                }}
                                onKeyDown={(e) => {
                                    if(e.key == "Enter"){
                                        handleVerify()
                                    }
                                }}
                                placeholder="Enter OTP"
                                className="border rounded-lg p-3 w-full "
                            />

                            <Link className="flex flex-1 items-center gap-1 text-blue-600">
                                < BiMessageAltDetail />
                                <h6>Resend code in 00:56</h6>
                            </Link>

                        </div>

                        <div className="flex flex-col justify-start w-8/12">
                            {
                                error && (
                                    <div className="flex justify-between items-center text-white bg-red-600 rounded-full py-3 text-sm px-4 mt-3 w-full">
                                        <span className="flex items-center gap-1">
                                            <LuTriangleAlert />
                                            {error}
                                        </span>
                                        <RxCross2
                                            className="cursor-pointer"
                                            onClick={() => setError("") }
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex flex-col w-11/12 mt-4 gap-3">
                            < Next 
                                onClick = {handleVerify}
                                color = "bg-primary"
                                text="Next"
                            />
                        </div>

                    </div>

                </div>
            </div>
    )
}