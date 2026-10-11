import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, replace } from "react-router-dom"

import { websiteName } from "../../data/constant"
import emailFind from "../../assets/email.svg";

// ICONS IMPORT
import { LuTriangleAlert, LuUser, LuPhone, LuShieldCheck} from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

// COMPONENTS IMPORT
import { Back, Next, SignUp, SignUp3 } from "../../components/button"

export function ForgotEmail(){

    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");                                                                                      
    const [error, setError] = useState("");

    const navigate = useNavigate();

    function navigateLogin(){
        navigate("/login");
    }


    async function handleVerify(){
        if(mobile.length !== 10) {
            setError("Please Enter a valid mobile number");
            return;
        }

        console.log("Mobile Number Submitted", mobile);
    }

    function handleNext(){
        
    }

    return(
        
        <div className="min-h-screen flex items-center justify-center ">
            <div className="flex flex-col bg-white rounded-2xl w-5/12 px-10 p-8 gap-2 min-h-[600px]">

                < Back 
                        onClick={navigateLogin}
                />

                <div className="flex flex-col justify-center items-center">

                    <h1 className="text-primary font-extrabold text-3xl m-4">WealthTrack</h1>

                    <div className="m-2">
                        <img src={emailFind}/>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-3">                                                           {/* Enter Email Otp Prompt */}
                        <h4 className="text-primary font-bold text-2xl">Find Your Registered Email</h4>

                        <h4 className="text-neutral-500 font-medium text-base text-center leading-relaxed max-w-md w-10/12">Enter your details below and we will help you to find the email associated with your account.</h4>

                    </div>

                    <div className="flex flex-col rounded-lg p-0.5 w-10/12 gap-2">
                        
                        <h4 className="font-semibold">Name</h4>

                        <div className="relative">

                            <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            
                            <input 
                                type="text" 
                                placeholder="Enter your name" 
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
                
                    <div className="flex flex-col rounded-lg p-0.5 w-10/12 gap-2 mt-2">
                        
                        <h4 className="font-semibold">Registered Mobile Number</h4>

                        <div className="relative">

                            <LuPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                            <input 
                                type="text" 
                                placeholder="Enter your mobile number" 
                                value = {mobile}
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

                    <div className="flex flex-col w-10/12 mt-7 gap-3">
                        
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
                            < Next 
                                color="bg-blue-600"
                                onClick={handleVerify}
                                text="Find My Email"
                            />
                        </div>

                    </div>

                    <div className="flex w-10/12 mt-5 gap-3 bg-sky-100 rounded-md p-5 border border-neutral-200">
                        
                        <LuShieldCheck className="text-blue-600 text-7xl " />

                        <div>
                            <h4 className="font-semibold">Your information is secure</h4>

                            <h4 className="text-neutral-500">We use this information only to help you recover your registered email address.</h4>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export function EmailFound(){
    return(
        <div></div>
    );
}

export function EmailNotFound(){
    return(
        <div></div>
    );
}
