import { useState } from "react";

import { useUser } from "../../context/UserContext";
import { getDateInfo } from "../../utils/date";

// ICON IMPORTS
import { LuCalendarClock, LuPersonStanding, LuSettings } from "react-icons/lu";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaCircleUser } from "react-icons/fa6";
import { IoMoonOutline, IoSettings } from "react-icons/io5";
import { HiMiniIdentification } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";
import { TbArrowsExchange, TbReportAnalytics } from "react-icons/tb";
import { MdOutlineDarkMode } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";

// COMPONENTS IMPORT
import { Save, ToggleButton} from "../../components/button"; 

export default function Profile()
{
    const {user} = useUser();

    const startDate = getDateInfo(user?.start_date);

    return(

        <div className="relative w-full overflow-x-hidden">

            {/* Blue Banner */}
            <div className="p-20 bg-[#8CB7FF]"></div>

            {/* Profile Circle */}
            <div className="absolute left-6 top-24">
                <div className="flex items-center justify-center w-32 h-32 rounded-full bg-blue-700 border-4 border-[#dbe7ff] ">
                    <FaUser className="text-white text-7xl"/>
                </div>
            </div>

            {/* Profile Info */}
            <div className="relative left-36 top-3 ml-4">
                
                <h1 className="font-bold text-primary text-xl">{user?.first_name} {user?.last_name}</h1>
                
                <h4 className="font-medium text-neutral-500 text-sm">Client ID : {user?.client_id}</h4>

            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-12 gap-6 mt-8">

                <div className="col-span-8 row-span-8 bg-white p-4 rounded-xl gap-10 space-y-6">
                    
                    <div className="flex gap-2 items-center">
                        < FaCircleUser />
                        <h1 className="font-bold text-primary text-lg">Personal Information</h1>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-4">                                                                                    {/* Name */}
                        
                        <label className=" col-span-3 font-bold text-primary text-lg">Name</label>
                        <div className="col-span-4">
                            <input
                            type="text"
                            value={user?.first_name}
                            className="border bg-inherit border-blue-200 rounded-lg px-2 py-1 text-lg outline-none  w-full"
                            />                                                                                                      {/* First Name */}
                        </div>
                        <div className="col-span-4">
                            <input
                            type="text"
                            value={user?.last_name}
                            className="border bg-inherit border-blue-200 rounded-lg px-2 py-1 text-lg outline-none w-full"
                            />                                                                                                      {/* Last Name */}
                        </div>

                    </div>

                    <div className="grid grid-cols-12 gap-4">                                                                                    {/* Email ID */}
                        <label className="col-span-3 font-bold text-primary text-lg">Email ID</label>
                        <div className="col-span-9">
                            <input
                            type="text"
                            value={user?.email}
                            className="bg-[#e8eef9] border bg-inherit border-blue-200 rounded-lg px-2 py-1 text-lg outline-none w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <label className="col-span-3 font-bold text-primary text-lg">Ph. Number</label>                                 {/* Ph. Number */}
                        <div className="col-span-9">
                            <input
                            type="text"
                            value={user?.phone}
                            className="border bg-inherit border-blue-200 rounded-lg px-2 py-1 text-lg outline-none w-full"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 items-center mt-2">
                        < RiLockPasswordFill />
                        <h1 className="font-bold text-primary text-lg">Password Change</h1>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <label className="col-span-3 font-bold text-primary text-lg">Current Password</label>                                 {/* Ph. Number */}
                        <div className="col-span-9">
                            <input
                            type="text"
                            className="border bg-inherit border-blue-200 rounded-lg px-2 py-1 text-lg outline-none w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <label className="col-span-3 font-bold text-primary text-lg">New Password</label>                                 {/* Ph. Number */}
                        <div className="col-span-9">
                            <input
                            type="text"
                            className="border bg-inherit border-blue-200 rounded-lg px-2 py-1 text-lg outline-none w-full"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        < Save />
                    </div>

                </div>

                {/* Settings */}
                <div className="col-span-4 row-span-4 flex flex-col bg-white p-4 rounded-xl  gap-4">

                    <div className="flex gap-2 items-center">
                        <IoSettings />
                        <h1 className="font-bold text-primary text-lg">Settings</h1>
                    </div>

                    <div className="flex gap-4 justify-between mx-4">                                                                                    {/* Email ID */}
                        <div className="col-span-5 flex items-center justify-center gap-2">
                            <MdOutlineDarkMode />
                            <label className=" font-bold text-primary text-base">Dark Mode</label>
                        </div>
                        <ToggleButton />
                    </div>
                    
                    <div className="flex gap-4 justify-between mx-4">                                                                                    {/* Email ID */}
                        <div className="col-span-5 flex items-center justify-center gap-2">
                            <LuCalendarClock />
                            <label className=" font-bold text-primary text-base">Portfolio Updates</label>
                        </div>
                        <ToggleButton />
                    </div>

                    <div className="flex gap-4 justify-between mx-4">                                                                                    {/* Email ID */}
                        <div className="flex items-center justify-center gap-2">
                            <HiOutlineMail  />
                            <label className=" font-bold text-primary text-base">Email Alerts</label>
                        </div>
                        <ToggleButton />
                    </div>

                    <div className="flex gap-4 justify-between mx-4">                                                                                    {/* Email ID */}
                        <div className="col-span-3 flex items-center justify-center gap-2">
                            <TbReportAnalytics />
                            <label className=" font-bold text-primary text-base">Quarterly Reports</label>
                        </div>
                        <ToggleButton />
                    </div>

                </div>

                {/* Account Information */}
                <div className="col-span-4 row-span-4 flex flex-col bg-white p-4 rounded-xl  gap-4">
                    
                    <div className="flex gap-2 items-center">
                        < HiMiniIdentification />
                        <h1 className="font-bold text-primary text-lg">Account Information</h1>
                    </div>

                    <div className="grid grid-cols-10 gap-4 mx-4">                                                                                    {/* Email ID */}
                        <h3 className="col-span-6 font-bold text-primary text-base">Status : </h3>
                        <span className="col-span-3 rounded-full px-3 py-1 bg-green-300 font-semibold text-[#0c5b43] text-sm">
                            {user?.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-10 gap-4 mx-4">                                                                                    {/* Email ID */}
                        <h3 className="col-span-6 font-bold text-primary text-base">Member Since : </h3>
                        <h3 className="col-span-4">{startDate.date} {startDate.monthName} {startDate.year}</h3>
                    </div>

                    <div className="grid grid-cols-10 gap-4 mx-4">                                                                                    {/* Email ID */}
                        <h3 className="col-span-6 font-bold text-primary text-base">Account Type : </h3>
                        <h3 className="col-span-4">{user?.role}</h3>
                    </div>

                    <div className="grid grid-cols-10 gap-4 mx-4">                                                                                    {/* Email ID */}
                        <h3 className="col-span-6 font-bold text-primary text-base">Last Session : </h3>
                        <h3 className="col-span-4"></h3>
                    </div>

                </div>

            </div>

            <div></div>

        </div>

    )
}