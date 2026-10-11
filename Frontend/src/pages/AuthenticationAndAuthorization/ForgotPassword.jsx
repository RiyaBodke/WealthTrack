import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, replace } from "react-router-dom"

import { websiteName } from "../../data/constant"
import lock from "../../assets/lock.svg";

// ICONS IMPORT
import { LuTriangleAlert, LuShieldCheck, LuMail} from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

// COMPONENTS IMPORT
import { Back, ButtonLink, Next, SignUp, SignUp3 } from "../../components/button"

export function ForgotPassword(){
    
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");                                                                                      
    const [error, setError] = useState("");

    const navigate = useNavigate();

    function navigatePassword(){
        navigate("/login/password");
    }


    async function handleVerify(){
        if(mobile.length !== 10) {
            setError("Please Enter a valid mobile number");
            return;
        }

        console.log("Mobile Number Submitted", mobile);
    }

    function handleNext(){
        navigate("")
    }

    return(
        
        <div className="min-h-screen flex items-center justify-center ">
            <div className="flex flex-col bg-white rounded-2xl w-5/12 px-10 p-8 gap-2 min-h-[600px]">

                < Back 
                        onClick={navigatePassword}
                />

                <div className="flex flex-col justify-center items-center">

                    <h1 className="text-primary font-extrabold text-3xl m-4">WealthTrack</h1>

                    <div className="flex flex-col justify-center items-center gap-3">                                                           {/* Enter Email Otp Prompt */}
                        
                        <h4 className="text-primary font-bold text-2xl">Forgot Password?</h4>

                        <h4 className="text-neutral-500 font-medium text-base text-center leading-relaxed max-w-md w-10/12">No worries! Enter your registered email and we'll help you reset your password.</h4>

                    </div>

                    <div className="m-2">
                        
                        <img src={lock}/>
                        
                    </div>

                    <div className="flex flex-col rounded-lg p-0.5 w-10/12 gap-2">
                        
                        <h4 className="font-semibold">Enter your email</h4>

                        <div className="relative">

                            <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            
                            <input 
                                type="text" 
                                placeholder="Enter your email address" 
                                value = {name}
                                onChange ={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setMobile(value);
                                }}
                                onKeyDown={(e) => {
                                    if(e.key == "Enter"){
                                        handleNext()
                                    }
                                }}
                                className="border rounded-lg py-3 pl-12 pr-4 w-full" />

                        </div>

                        

                    </div>

                    <div className="flex flex-col w-10/12 mt-8 gap-3">
                        
                        {
                            error && (
                                <div className="flex justify-between items-center text-white bg-red-600 rounded-full py-3 text-sm -mt-4 px-4 w-full">
                                    <span className="flex items-center gap-1">
                                        <LuTriangleAlert />
                                        {error}
                                    </span>
                                        <RxCross2
                                            className="cursor-pointer"
                                            onClick={() => setError("")}
                                        />
                                </div>
                            )
                        }

                        <div className="flex flex-col gap-3 w-full">
                            < ButtonLink 
                                color="bg-blue-600"
                                onClick={handleVerify}
                                text="Send Reset Link"
                            />
                        </div>

                    </div>

                    <div className="flex items-center justify-center w-10/12 mt-8 gap-3 bg-sky-100 rounded-md p-2">
                        
                        <LuShieldCheck className="text-blue-600 text-2xl " />

                        <div>
                            <h4>Your information is secure with us.</h4>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export function CheckEmail(){
    return(
        <div></div>
    );
}

export function EmailNotFound(){
    return(
        <div></div>
    );
}

export function ResetLinkExpired(){
    return(
        <div></div>
    );
}

export function ResetPassword(){
    return(
        <div></div>
    );
}

export function ResetPasswordSuccessful(){
    return(
        <div></div>
    );
}