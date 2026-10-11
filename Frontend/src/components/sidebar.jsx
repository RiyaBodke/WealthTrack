import { NavLink } from "react-router-dom"

import { useUser } from "../context/UserContext";

import { LuLayoutDashboard, LuBriefcaseBusiness, LuHistory, LuUsers, LuArrowLeftRight, LuClipboardList, LuInbox, LuCircleHelp, LuCircleUserRound, LuHeadphones } from "react-icons/lu"
import { RiStockLine } from "react-icons/ri";
import { FiBell } from "react-icons/fi";


export function Sidebar(){
    
    const {user} = useUser();

    return(
        <div className ="hidden md:flex flex-col bg-primary h-screen fixed top-0 left-0 w-60 z-50 px-4 py-6">

            < div className="flex items-center gap-3 px-2 mb-10">
                <h1 className="text-white text-xl font-bold"> WealthTrack</h1>
            </div>
            
            <div className="mb-6">

                <p className="text-white/70 text-sm font-semibold px-2 mb-4">
                    PORTFOLIO
                </p>

                <div className="flex flex-col gap-2">

                    <NavLink
                        to="/portfolio/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                            ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                        }
                    >
                        <LuLayoutDashboard className="w-6 h-6" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/portfolio/holdings"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                            ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                        }
                    >
                        <LuBriefcaseBusiness className="w-6 h-6" />
                        <span>Holdings</span>
                    </NavLink>

                    <NavLink
                        to="/portfolio/history"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                            ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                        }
                    >
                        <LuHistory className="w-6 h-6" />
                        <span>History</span>
                    </NavLink>

                    <NavLink
                        to="/portfolio/transaction"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                            ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                        }
                    >
                        <LuArrowLeftRight className="w-6 h-6" />
                            <span className="text-base font-medium">
                                Transactions
                            </span>
                    </NavLink>

                </div>

            </div>

            { user?.role == "admin" && (
                <div className="border-t border-white/10 pt-6 mb-6">

                    <p className="text-white/70 text-xs font-semibold px-2 mb-4">
                        CLIENT MANAGEMENT
                    </p>

                    <div className="flex flex-col gap-2">

                        <NavLink
                            to="/user-management/clients"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                                ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                            }
                        >
                            <LuUsers className="w-6 h-6" />
                            <span className="text-base font-medium">
                                Clients
                            </span>
                        </NavLink>

                        <NavLink
                            to="/user-management/trading-workspace"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                                ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                            }
                        >
                            <RiStockLine className="w-6 h-6" />
                            <span className="text-base font-medium">
                                Trading Workspace
                            </span>
                        </NavLink>

                        <NavLink
                            to="/user-management/notification-management"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                                ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                            }
                        >
                            <FiBell className="w-6 h-6" />
                            <span className="text-base font-medium">
                                Notifications
                            </span>
                        </NavLink>

                        <NavLink
                            to="/user-management/activity-logs"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                                ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                            }
                        >
                            <LuClipboardList className="w-6 h-6" />
                            <span className="text-base font-medium">
                                Activity Logs
                            </span>
                        </NavLink>

                    </div>
                </div>
            )}

            <div className="border-t border-white/10 pt-6">

                <p className="text-white/70 text-xs font-semibold px-2 mb-4">
                    ACCOUNT
                </p>

                <div className="flex flex-col gap-2">

                    { user?.role == "client" && (
                        <NavLink
                            to="/help"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                                ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                            }
                        >
                            <LuCircleHelp className="w-6 h-6" />
                            <span className="text-base font-medium">
                                Help
                            </span>
                        </NavLink>
                    )}

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-3 py-3 rounded-xl text-white
                            ${isActive ? "bg-white/10" : "hover:bg-white/10"}`
                        }
                    >
                        <LuCircleUserRound className="w-6 h-6" />
                        <span className="text-base font-medium">
                            Profile
                        </span>
                    </NavLink>

                </div>
            </div>

            { !(user?.role == "admin") && (
                <div className="mt-auto">

                    <div className="bg-blue-700 rounded-2xl p-5">

                        <h3 className="text-white font-semibold text-sm">
                            Need help with
                            <br />
                            your portfolio?
                        </h3>

                        <p className="text-white/70 text-xs mt-4">
                            Our team is here to help you
                            with any assistance.
                        </p>

                        <button className="
                            w-full
                            mt-5
                            flex
                            items-center
                            justify-between
                            px-4
                            py-2
                            rounded-lg
                            border
                            border-white/20
                            text-white
                            font-semibold
                            text-xs
                        ">
                            <span>Contact Manager</span>
                            <LuHeadphones className="w-5 h-5" />
                        </button>

                    </div>

                </div>
            )}

        </div>

    )
}

