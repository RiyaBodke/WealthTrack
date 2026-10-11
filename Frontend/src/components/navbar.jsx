import { LuAlignJustify, LuBell, LuChevronDown, LuLogOut } from "react-icons/lu"
import { useRef, useEffect, useState } from "react"
import { Link, Navigate, useNavigate, NavLink, useLocation } from "react-router-dom"
import { FaRegUser } from "react-icons/fa";
import { user } from "../data/user"
import { useUser } from "../context/UserContext";
import { LogIn, SignUpB } from "./button";

export function Navbar(){

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    const location = useLocation();
    
    const pageInfo = {

        "/portfolio/dashboard": {
            title: "Dashboard",
            subtitle: "Client Overview"
        },

        "/portfolio/holdings": {
            title: "Holdings",
            subtitle: "View and manage your current investments"
        },

        "/portfolio/holdings/add-trade": {
            title: "Add Trade",
            subtitle: "Buy a stock and add it to client's portfolio"
        },

        "/portfolio/history": {
            title: "Trade History",
            subtitle: "Analyze past investment activity and trends"
        },

        "/portfolio/transaction": {
            title: "Transactions",
            subtitle: "View and manage portfolio transactions"
        },

        "/user-management/clients": {
            title: "Clients",
            subtitle: "Manage your portfolio clients"
        },

        "/user-management/trading-workspace": {
            title: "Trading Workspace",
            subtitle: "Manage your portfolio clients"
        },

        "/user-management/notification-management": {
            title: "Notifications",
            subtitle: "Manage your portfolio clients"
        },

        "/user-management/pending-approvals": {
            title: "Pending Approvals",
            subtitle: "Review and manage pending requests"
        },

        "/user-management/clientdetails": {
            title: "Client Details",
            subtitle: "View detailed client information"
        },

        "/user-management/activity-logs": {
            title: "Activity Logs",
            subtitle: "View detailed client information"
        },

        "/account/help": {
            title: "Help",
            subtitle: "Get assistance with WealthTrack"
        },

        "/account/profile": {
            title: "Profile",
            subtitle: "Manage your account and preferences"
        }
    };
    const currentPage = pageInfo[location.pathname];

    const { user, clearUser } = useUser();

    const isLoggedIn = !!user;
    const isAdmin = user?.role === "admin";
    const isClient = user?.role === "user";

    function logIn(){
        
        navigate("/login", {
            replace: true
        });
    }

    function navClass({ isActive }){
        return isActive ?
            "bg-blue-back text-blue-text font-bold py-1 px-4 rounded-full"
            : "text-primary py-1 px-4";
    }

    function handleLogout(){

        clearUser();

        navigate("/", { 
            replace : true 
        });
    }

    useEffect( () => {

        function handleClickOutside(event){

            if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        
        };

    }, []);

    return(
        <div 
            className="w-full px-6 flex items-center justify-between">
            
            {/* Left Top */}
            <div className="flex flex-col items-baseline whitespace-nowrap gap-1">
                
                <h1 className= "text-primary text-2xl font-bold"> {currentPage?.title} </h1>

                <p className= "text-sm font-medium text-primary/70"> {currentPage?.subtitle} </p>

            </div>

            {/* Right Top */}
            <div className="flex items-center gap-3">

                {user ? (
                    <>
                        {/* Notification Icon */}
                        <div className="px-3">
                            <LuBell className = "w-4 h-4 md:w-7 md:h-7" ></LuBell>                                                                            {/* Notification Bell Icon */}
                        </div>
                        

                        {/* Profile */}
                        <div 
                            ref={dropdownRef}
                            onClick = {() => setOpen(!open)}
                            className = "relative cursor-pointer flex justify-center items-center bg-blue-back w-10 md:w-auto h-10 md:h-14 pl-2 pr-2 py-2 rounded-full my-4 ">            {/* Profile Blue Tab */}
                        
                            <div className = "flex justify-center items-center bg-green-profile w-8 md:w-10 h-8 md:h-10 rounded-full py-2 px-2">              {/* Green Circle */}
                                <p className = "text-green-800 font-semibold">
                                    {user?.first_name?.[0]}                                                                                                                          {/* Client Profile Text */}
                                </p>
                            </div>
                            

                            <div>
                                <h6 className="hidden md:flex py-2 px-1">                                                                                           {/* Client Name */}
                                    {user?.first_name} {user?.last_name}
                                </h6>
                            </div>

                            {/* Dropdown Arrow */}
                            <div className="relative flex items-center">
                                
                                <LuChevronDown className= {`hidden md:flex w-5 h-5 transition-ransform duration-200 ${open ? "rotate-180" : "rotate-0"}`} />
                                
                                {
                                    open && (

                                        <div className="absolute top-11 -right-1 w-44 bg-white rounded-2xl shadow-xl drop-shadow-2xl border overflow-hidden z-20">

                                            <Link
                                                to="/profile"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-2 w-full px-5 py-4 hover:bg-green-100 transition-colors duration-150"
                                            >
                                                
                                                < FaRegUser />
                                                
                                                <h6>My Profile</h6>
                                            
                                            </Link>

                                            <hr />

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLogout();
                                                    setOpen(false);
                                                }}
                                                className="flex items-center gap-2 w-full text-left px-5 py-4 hover:bg-red-100 text-red-600"
                                            >
                                                
                                                <LuLogOut />

                                                <h6>Logout</h6>

                                            </button>
                                        </div>

                                    )
                                }                                                                {/* Drop Down Arrow Icon */}
                            </div>

                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex gap-2">

                            < SignUpB />

                            < LogIn onClick={logIn} />

                        </div>
                    </>
                )}
                
                
                </div>

            </div>
    )
}
