import { FaCheck, FaTimes } from "react-icons/fa";
import { IoCheckmarkSharp } from "react-icons/io5";
import { LuMail, LuSearch, LuPlus, LuPen, LuFilter, LuCalendar, LuChevronDown, LuChartColumn, LuSlidersHorizontal, LuArrowLeft } from "react-icons/lu" 
import { RiDeleteBin6Line } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";

export function Chat({ onClick }){

    return(
        <button 
            onClick={onClick}
            className = "h-11 rounded-full bg-blue-600">
                <div className="flex items-center gap-2 px-6 justify-start">
                    <LuMail className="text-white" />
                    <h4 className="text-white text-xs font-black ">Contact Portfolio Manager</h4>
                </div>
        </button>

    )
}

export function SearchBar({ value, onChange, placeholder = "Search" }) {
    return (
        <div className="flex h-9 w-80 bg-white items-center gap-2 px-4 rounded-lg border border-slate-200">

            <LuSearch className="text-slate-400 shrink-0" />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            />

        </div>
    );
}

export function Add({name, onClick}){

    return(
        <button 
            onClick = {onClick}
            className="flex items-center gap-2 h-9 px-6 bg-blue-600 text-sm rounded-lg text-white"
        >
            <LuPlus />
            <h3>Add New {name}</h3>
        </button>
    )
}

export function Edit(){
    return(
        <button className="flex items-center gap-2 h-9 px-6 bg-white text-sm rounded-lg" >
            <LuPen />
            <h3>Edit</h3>
        </button>
    )
}

export function SortBy({ value, onChange, options = []}){
    
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(
        option => option.value === value
    );
    
    return(
        <div className="relative">

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 h-9 px-6 bg-white text-sm rounded-lg"
            >

                <LuFilter />

                <span>
                    Sort By : {selectedOption?.label}
                </span>

                <LuChevronDown />

            </button>


            {isOpen && (

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">

                    {options.map((option) => (

                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                        >
                            {option.label}
                        </button>

                    ))}

                </div>

            )}

        </div>
    )
}

export function FinancialYear({value, onChange, options}){
    
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    return(
        <div 
            ref={dropdownRef}
            className="relative">

            <button 
                onClick = {() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 h-9 px-6 bg-white text-base rounded-lg"
            >
                <LuCalendar />
                <h3>Financial Year :  
                    <span className="font-semibold text-blue-600"> {value}</span>
                </h3>
                <LuChevronDown />
            </button>

            {isOpen && (
                <div className="absolute top-11 left-0 z-50 w-full min-w-[180px] max-h-52 overflow-y-auto bg-white rounded-lg shadow-lg border border-slate-200">
                    
                    { options.map((year) => (
                        
                        <button
                            key={year}
                            onClick={ () => {
                                onChange(year);
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-100 ${
                                value === year
                                    ? "font-semibold text-blue-600 bg-blue-50"
                                    : ""
                            }`}
                        >
                            {year}
                        </button>
                    
                    ))}
                
                </div>
            )}

        </div>
    );
}

export function Quarter({ value, onChange }){
    
    const options = [
        {
            value: "all",
            label: "All"
        },
        {
            value: "Q1",
            label: "Q1"
        },
        {
            value: "Q2",
            label: "Q2"
        },
        {
            value: "Q3",
            label: "Q3"
        },
        {
            value: "Q4",
            label: "Q4"
        }
    ];

    return(
        <div className="flex items-center gap-2 h-9 px-6 bg-white text-sm rounded-lg">
            <LuChartColumn />
            <h3>Quarter : </h3>

            {options.map((option) => (

                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={`
                        px-4
                        h-7
                        rounded-md
                        text-sm
                        font-medium
                        transition-colors

                        ${
                            value === option.value
                                ? "bg-[#e4eeff] text-blue-700"
                                : "text-slate-500 hover:bg-slate-100"
                        }
                    `}
                >
                    {option.label}
                </button>
                ))}
        </div>
    );
}

export function ExportReport(){
    return(
        <button className="flex items-center gap-2 h-9 px-6 bg-white text-sm rounded-lg bg-custom-gradient-green">
            <h3 className="text-white">Export Report</h3>
        </button>
    )
}


export function Delete(){
    return(
        <button className="flex items-center gap-2 h-9 px-6 bg-red-600 text-sm rounded-lg">
            <RiDeleteBin6Line className="text-white"/>
            <h3 className="text-white">Delete</h3>
        </button>
    )
}

export function Filter(){
    return(
        <button className="flex items-center gap-2 h-9 px-6 bg-white text-sm rounded-lg">
            <LuSlidersHorizontal />
            <h3>Filter</h3>
        </button>
    )
}

export function Approve(){
    return(
        <button className="flex justifycenter items-center p-3 bg-custom-gradient-green text-white font-semibold rounded-lg gap-2">
            <FaCheck className="font-bold"/>
            <h6>Approve</h6>
        </button>
    )
}

export function Reject(){
    return(
        <button className="flex justifycenter items-center py-3 px-5 bg-red-600 text-white font-semibold rounded-lg gap-2">
            <FaTimes className="font-bold"/>
            <h6>Reject</h6>
        </button>
    )
}

export function ToggleButton(){
    
    const [enabled, setEnabled] = useState(() => {
        const saved = localStorage.getItem("toggle");

        return saved === "true";
    });

    useEffect(() => {
        localStorage.setItem("toggle", enabled);
    }, [enabled]);

    return(
        <button onClick={() => setEnabled(!enabled)} className={`w-16 h-8 rounded-full p-1 transition-all duration-300 ${enabled ? "bg-teal-600" : "bg-blue-200"}`}>
            <div className={`h-6 w-6 rounded-full bg-white transition-all duration-300 ${enabled ? "translate-x-8" : "translate-x-0"}`}/>
        </button>
    )
}

export function Save(){
    return(
        <button className="flex items-center gap-2 py-2 px-6 bg-blue-600 text-sm rounded-lg text-white">
            <h3>Save</h3>
        </button>
    )
}

export function SignUp(){
    return(
        <button className="flex items-center gap-2 py-2 px-6 bg-blue-600 text-sm font-semibold rounded-full text-white">
            <h3>Sign Up</h3>
        </button>
    )
}

export function SignUpB(){
    return(
        <button className="flex items-center gap-2 py-3 px-8 bg-blue-600 font-bold text-sm rounded-full text-white">
            <h3>Sign Up</h3>
        </button>
    )
}

export function LogIn({onClick}){
    return(
        <button 
            onClick={onClick}
            className="flex items-center gap-2 py-3 px-8 text-sm rounded-full text-blue-600 font-bold border-blue-600 bg-white border-2">
            <h3>Log In</h3>
        </button>
    )
}

export function Next({onClick, color, text}){

    return(
        <button 
            onClick = {onClick}
            className={`flex justify-center items-center w-full py-2.5 ${color} text-white rounded-full font-bold`}>{text}</button>
    )
}

export function SignUp3(){
    return(
        <button className="flex justify-center items-center w-full py-2.5 bg-inherit border-2 border-black text-black rounded-full font-bold">Sign Up</button>
    )
}

export function Back({onClick}){
    return(
        <div 
            onClick={onClick}
            className="flex justify-start items-center text-blue-600 font-semibold gap-2">
                < LuArrowLeft />
                Back
        </div>
    )
}

export function ButtonLink({onClick, color, text}){

    return(
        <button 
            onClick = {onClick}
            className={`flex justify-center items-center w-full py-2.5 ${color} text-white rounded-full font-bold`}>{text}</button>
    )
}

export function ButtonRetry({onClick, color, text}){

    return(
        <button 
            type="button"
            onClick = {onClick}
            className={`flex justify-center items-center w-full py-2.5 ${color} text-white rounded-full font-bold`}>{text}</button>
    )
}

export function Cancel({ onClick }){
    return(
        <button
            type="button"
            onClick={onClick}
            className=" px-8 h-10 rounded-lg border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50"
        >
            Cancel
        </button>
    )
}

export function AddHoldingButton(){
    return(
        <button
            type="button"
            className="flex items-center px-7 h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
            Add Holding
        </button>
    )
}