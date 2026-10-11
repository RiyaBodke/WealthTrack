import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, replace } from "react-router-dom"

import { websiteName } from "../../data/constant"
import emailFind from "../../assets/email.svg";

// ICONS IMPORT
import { LuTriangleAlert, LuUser, LuPhone, LuShieldCheck} from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

// COMPONENTS IMPORT
import { Back, Next, SignUp, SignUp3 } from "../../components/button"


export function LogIn(){
    
    const [email, setEmail] = useState(sessionStorage.getItem("loginEmail") || "");                                                                                      
    const [error, setError] = useState("");

    const navigate = useNavigate();

    function navigateHome(){
        
        sessionStorage.removeItem("loginEmail");
        sessionStorage.removeItem("authStep");
        sessionStorage.removeItem("loginPassword");

        navigate("/");
    }

    async function handleNext(){
        
        if(!email.trim())
        {                                                                  // Condition to check if email field is empty
            setError("Please enter your email");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/check-email`,

                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                }

            );

            const data = await response.json();

            if (data.exists)                                            // Condition to check if email exists in backend or not
            {
                sessionStorage.setItem("loginEmail", email);

                sessionStorage.setItem("authStep","email");
                
                navigate("/login/password",);

                setError("");
            }
            else
            {
                setError("Email not Found");
            }

        }catch (error) 
        {
            setError("Something went wrong");
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center ">
            <div className="flex flex-col bg-white rounded-2xl w-5/12 px-10 pt-8 pb-44 gap-2 min-h-[600px]">

                < Back 
                    onClick={navigateHome}
                />
                
                <div className="flex flex-col justify-center items-center">
                    
                    <h1 className="text-primary font-extrabold text-3xl m-7">{websiteName}</h1>

                    <div className="flex flex-col w-11/12 gap-2 m-4">
                        
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value = {email}
                            onChange ={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key == "Enter"){
                                    handleNext()
                                }
                            }}
                            className="border rounded-lg p-3 w-full" 
                        />
                    
                        <Link className="w-11/12 text-blue-600 text-left" to="/login/forgotemail">
                            <h4 className="text-blue-600 flex-1">Forgot your email ?</h4>
                        </Link>

                    </div>

                    {
                        error && (
                            <div className="flex justify-between items-center text-white bg-red-600 rounded-full py-3 text-sm px-4 w-11/12">
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

                    <div className="flex flex-col w-11/12 mt-4 gap-4">
                        
                        < Next  onClick={handleNext} 
                                color="bg-blue-600"
                                text="Next"
                        />

                        <div className="flex items-center w-full">
                            
                            <div className="flex-1 h-px bg-slate-300"></div>

                            <span className="px-3 text-sm">
                                or
                            </span>

                            <div className="flex-1 h-px bg-slate-300"></div>

                        </div>

                            <SignUp3 />

                    </div>

                </div>

            </div>
        </div>
    );

}



export function Password(){

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const email = sessionStorage.getItem("loginEmail");

    useEffect(() => {

        const step = sessionStorage.getItem("authStep");

        if( step !== "email" && step !== "password")
        {
            navigate("/login",{
                replace : true
            });
        }

    }, [navigate]);

    function navigateLogin(){
        navigate("/login");
    }
    
    async function handleNext(){

        if(!password.trim()){
            setError("Please enter your password");
            return;
        }

        try{
            
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/check-password`,
                {
                    method :"POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if(data.success)
            {
                sessionStorage.setItem("authStep", "password");

                navigate("/login/emailverification");

                setError("");
            }
            else
            {
                setError("Incorrect Password");
            }

        } catch(error){
            setError("Something went wrong");
        }
        
    }

    return(
        <div className="min-h-screen flex items-center justify-center ">
            <div className="flex flex-col bg-white rounded-2xl w-5/12 px-10 pt-8 pb-44 gap-2 min-h-[600px]">
                
                < Back 
                    onClick={navigateLogin}
                />

                <div className="flex flex-col justify-center items-center">

                        <h1 className="text-primary font-extrabold text-3xl m-7">{websiteName}</h1>

                        <div className="flex flex-col w-11/12 gap-2 m-4">
                            
                            <input 
                                    type="password"
                                    placeholder="Enter your password" 
                                    value = {password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if(e.key == "Enter"){
                                            handleNext()
                                        }
                                    }}
                                    className=" border rounded-lg p-3 w-full" 
                            />

                            <Link className="w-11/12 text-blue-600 text-left" to="/login/forgotpassword">
                                <h4 className="text-blue-600 flex-1">Forgot your password ?</h4>
                            </Link>

                        </div>

                        {
                            error && (
                                <div className="flex justify-between items-center text-white bg-red-600 rounded-full py-3 text-sm px-4 w-11/12">
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

                        <div className="flex flex-col mt-3 gap-3 w-11/12">
                            < Next  onClick={handleNext} 
                                    color="bg-blue-600"
                                    text="Next"/>
                        </div>

                

                </div>

            </div>
        </div>
    )
}

