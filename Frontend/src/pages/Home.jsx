import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, SignUp, SignUpB } from "../components/button";

export default function Home()
{
    
    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = "body-home";
    
        return () => {
            document.body.className = "";
        };
    }, []);

    const [email, setEmail] = useState("");
    console.log(email);

    function logIn(){
        
        navigate("/login", {
            replace: true
        });
    }

    return(
        <div >
            
            <div className="flex justify-center items-center text-primary font-bold text-4xl pt-8 pb-4 gap-4">
                <h1>Track.</h1>
                <h1>Analyze.</h1>
                <h1>Grow.</h1>  
            </div>
            
            <div className="flex justify-center items-center gap-1 p-8">
                <h1 className="text-primary font-bold text-xl">Start your investment journey with</h1>
                <h1 className="text-blue-600 font-bold text-xl">WealthTrack</h1>
            </div>

            <div className="flex justify-center">
                <div className="flex justify-center items-center w-4/12 border border-blue-300 rounded-full p-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-inherit text-lg outline-none px-6 "
                    />
                    <Link to="/signup">
                        <SignUp />
                    </Link>
                </div>
            </div>

            <div className="flex justify-center gap-3 p-6">
                
                <Link to="/signup">
                    <SignUpB />
                </Link>

                <LogIn onClick={logIn}/>

            </div>

        </div>
    )
}