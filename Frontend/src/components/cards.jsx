import { Link } from "react-router-dom"
import { useState } from "react";
import { LuWallet, LuTrendingUp, LuTrendingDown, LuUser, LuUserPlus, LuPlus, LuUsers } from "react-icons/lu"
import { FaUser } from "react-icons/fa";
import { user } from "../data/user"
import { useUser } from "../context/UserContext";

export function NiftySensexCard(){
    return(
        <div className ="bg-white rounded-lg px-4 py-5 flex flex-col justify-evenly gap-3" >
            
            {/* Nifty */}
            <span className=" flex ">
                
                <span>
                    <h4 className="text-sm" >NIFTY</h4>
                    <h4 className="text-green-600 text-xs font-bold" >13.75 (0.06%) </h4>
                </span>

                <span></span>
                
            </span>

            {/* Sensex */}
            <span className=" flex ">

                <span>
                    <h4 className="text-sm" >SENSEX</h4>
                    <h4 className="text-green-600 text-xs font-bold" >63.75 (0.08%) </h4>
                </span>

                <span></span>
                
            </span>

        </div>
    )
}

export function PortfolioAmountCard(){
    
    const { user, clearUser } = useUser()

    const portfolioAmount = Number(user?.portfolio_amount) || 0;
    const investedAmount = Number(user?.invested_amount) || 0;
    const investedPercentage =  portfolioAmount > 0 
                                ?   Math.min(Math.round((investedAmount / portfolioAmount)* 100), 100)
                                : 0;

    return(
        <div className =" bg-white rounded-lg px-4 py-5 flex flex-col justify-between" >
            
            <span>
                <h4 className="text-[#8D959D] text-sm font-semibold" >Portfolio Amount</h4>
                <h4 className="text-primary text-lg font-bold" >₹{portfolioAmount.toFixed(2)}</h4>
            </span>
            
            <span className="flex gap-2">
                <h4 className="text-primary text-sm font-semibold" >₹{investedAmount.toFixed(2)}</h4>
                <h4 className=" text-[#8D959D] text-sm font-semibold" >invested</h4>
            </span>

            <span className=" bg-blue-200 rounded-full h-4 ">

                <span className="flex items-center justify-between px-1 gap-0.5">
                    <span 
                        className= " bg-blue-700 rounded-full h-2"
                        style={{width: '{investedPercentage}'}}
                    ></span>
                    <span className=" text-xxs text-blue-700 font-extrabold ">{investedPercentage.toFixed(0)}%</span>
                </span>

            </span>

        </div>
    )
}

export function CurrentValueCard(){
    
    const { user } = useUser();

    const formattedDate =   user?.start_date 
                            ? new Date(user.start_date).toLocaleDateString("en-IN",{
                                day: "numeric",
                                month: "long",
                                year : "numeric"
                            })
                            : "";
    
    return(
        <div className =" bg-white rounded-lg px-4 py-5 flex flex-col justify-between" >
            
            <div>
                <h4 className="text-primary text-sm font-bold" >Current Value</h4>
                <h4 className="text-primary text-lg font-bold" >₹51,383.20</h4>
            </div>
            
            <div className="flex justify-between items-end">
                
                <div>
                    <h4 className="text-[#8D959D] text-xs font-semibold" >{formattedDate}</h4>
                    <h4 className="text-[#8D959D] text-xs font-semibold" >PMS Start Date</h4>
                </div>

                <div className=" flex justify-center items-center bg-blue-200 rounded-md h-6 w-6">
                    <Link to="/portfolio/holdings">
                        <LuWallet className=""></LuWallet>
                    </Link>
                </div>
                
            </div>
            
        </div>
    )
}

export function NetProfitCard(){
    return(
        <div className ="bg-custom-gradient-green rounded-lg px-4 py-6 flex flex-col justify-between" >
            
            <span>
                <h4 className="text-white text-sm font-bold" >Net Profit</h4>
                <h4 className="text-white text-lg font-bold" >₹{user.netProfit}</h4>
            </span>
            
            <span className="flex items-center gap-1">
                <LuTrendingUp className=" text-white"></LuTrendingUp>
                <h4 className="text-white text-sm font-semibold" >2.77 % this week</h4>
            </span>
            
        </div>
    )
}

export function ProfitCard(){
    
    const [selectedTab, setSelectedTab] = useState("realized");

    const realizedProfit = 0;
    const unrealizedProfit = 1383.20;

    return(
        <div className =" bg-white rounded-lg px-4 py-6 flex flex-col gap-5" >
            
            <div className="flex justify-evenly items-center rounded-md bg-blue-200 h-12">
                
                <button
                    onClick={() => setSelectedTab("realized")}
                    className={`w-1/2 h-full py-3 rounded-lg transition-all duration-300 text-sm font-bold
                        ${
                            selectedTab === "realized"
                            ? "bg-gradient-to-b from-[#a9c8ff] to-[#7da8ff] shadow-md"
                            : "text-gray-700"
                        }`}
                >
                    Realized
                </button>

                <button
                    onClick={() => setSelectedTab("unrealized")}
                    className={`w-1/2 h-full py-3 rounded-lg transition-all duration-300 text-sm font-bold
                        ${
                            selectedTab === "unrealized"
                            ? "bg-gradient-to-b from-[#a9c8ff] to-[#7da8ff] shadow-md"
                            : "text-gray-700"
                        }`}
                >
                    Unrealized
                </button>
                
            </div>
            
            <h2 className="text-lg font-bold">
                ₹ {selectedTab === "realized"
                    ? realizedProfit.toFixed(2)
                    : unrealizedProfit.toFixed(2)}
            </h2>
            
        </div>
    )
}

export function ProfitSharingCard(){
    return(
        <div className =" bg-white rounded-lg px-4 py-5 flex flex-col gap-3" >
            
            <div>
                <h4 className="text-primary text-sm font-bold" >Profit Sharing</h4>
            </div>
            
            <div className="flex flex-col gap-3">
                
                <div className="flex justify-evenly items-center gap-1">
                    <div className="flex-[2] min-w-0 flex items-center justify-start bg-custom-gradient-green text-white py-2 px-3 text-xs h-6 rounded-l-full font-semibold leading-none">
                        ₹921.60
                    </div>
                    <span className="flex-[1] min-w-0 flex items-center justify-center bg-blue-700 text-white py-2 px-3 text-xs h-6 rounded-r-full font-semibold leading-none">
                        ₹461.06
                    </span>
                </div>

                <span className="flex justify-between">
                    <p className="text-xs font-semibold">Client</p>
                    <p className="text-xs font-semibold">Manager</p>
                </span>

            </div>
            
        </div>
    )
}

export function ClientInfoCard(){
    return(
        <span className="bg-white w-auto rounded-lg px-4 py-3 flex gap-4">
            <span className="bg-blue-500 rounded-2xl py-2 px-10 flex items-center justify-center">
                <FaUser className="text-white text-7xl"/>
            </span>

            <span>
                
                <h2 className="font-bold text-lg">{user.firstName} {user.lastName}</h2>

                <span className="rounded-full px-2 py-1 text-xs bg-green-300 font-semibold text-green-700">
                    {user.status}
                </span>

                <div className="flex gap-1 text-sm">
                    <h4 className="font-bold">Client: </h4>
                    <h4>{user.clientId}</h4>
                </div>

                <div className="flex gap-1 text-sm">
                    <h4 className="font-bold"> Email:</h4>
                    <h4>{user.emailId}</h4>
                </div>

                <div className="flex gap-1 text-sm">
                    <h4 className="font-bold">Ph. No.: </h4>
                    <h4>{user.phNumber}</h4>
                </div>

            </span>
        </span>
    )
}

export function TotalUsersCard({totalUsers}){
    return(
        <span className ="bg-custom-gradient-green h-24 rounded-2xl px-6 py-4 flex justify-evenly items-center">
            <span className="flex flex-col items-center justify-center">
                < LuUsers className="text-white font-medium text-4xl"/>
                <h3 className="text-white font-medium text-xl">{totalUsers}</h3>
            </span>

            <span className="flex flex-col place-items-start justify-stretch">
                <h3 className="text-white font-semibold text-xl">Total Users</h3>
                <h4 className="text-white font-medium text-sm">All registered users</h4>
            </span>
        </span>
    )
}

export function PendingUsersCard(){
    return(
        <Link to="pendingapprovals">
            <button className ="bg-white h-24 rounded-2xl px-6 py-4 flex justify-evenly items-center gap-4">
                <span className="flex flex-col place-items-start justify-stretch">
                    <h3 className="font-semibold text-xl">Pending Users</h3>
                    <h4 className="font-medium text-sm">Awaiting Approval</h4>
                </span>

                <span className="flex flex-col items-center justify-center">
                    < LuUserPlus className="font-medium text-4xl"/>
                    <h3 className= "font-medium text-xl">0</h3>
                </span>

            </button>
        </Link>
    )
}