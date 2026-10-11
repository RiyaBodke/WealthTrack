import { useState } from "react";
import axios from "axios";
import { LuInfo, LuLoaderCircle, LuMail, LuClock3, LuBell, LuWifi } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { FaPaperPlane, FaCheck, FaXmark } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";

export function ContactModal({isOpen, onClose, user}){
    
    const [ subject, setSubject ] = useState("Portfolio Support");
    const [ message, setMessage ] = useState("");
    const [ view, setView ] = useState("form");

    if(!isOpen) return null;

    const handleClose = () => {
        
        setMessage("");
        setSubject("Portfolio Support");
        setView("form");

        onClose();
    };

    const sendMessage = async () => {
        
        if (!message.trim()){

            alert("Please enter a message");
            return;

        }

        setView("loading");

        try{

            const response = await axios.post(

                `${import.meta.env.VITE_API_URL}/api/contact/send-message`,
                {
                    
                    userName : `${user.first_name} ${user.last_name}`,

                    userEmail: user.email,

                    subject,

                    message

                }
            );

            setView("success");

        } catch(error){

            console.error(error);
            
            setView("error");

        }

    }

    return(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            
            { view === "form" && (

                <div className="flex flex-col bg-white p-8 rounded-lg w-[550px] gap-6 h-[750px]">
                
                        <div className="flex justify-between items-center bg-white rounded-lg">
                            
                            <h1 className="font-bold text-xl">Contact Portfolio Manager</h1>

                            <button 
                                onClick={onClose}
                                className="text-2xl"
                            >
                                <RxCross2 />
                            </button>

                        </div>

                        <div className="flex gap-5">

                            <div className="rounded-full bg-blue-100 p-4">
                                < MdOutlineMail className="text-3xl text-blue-700"/>
                            </div>

                            <div className="flex flex-col justify-evenly">
                                <h2>Send a message to your portfolio manager.</h2>
                                <h2 className="text-zinc-500">We typically respond within 24 hours.</h2>
                            </div>

                        </div>

                        <div className="flex flex-col gap-2">

                            <label className=" block font-semibold">
                                Subject
                            </label>

                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3"
                                onFocus={(e) => e.target.blur()}
                            >
                                <option value="Portfolio Support">Portfolio Support</option>
                                <option value="Investment Query">Investment Query</option>
                                <option value="Technical Issue">Technical Issue</option>
                                <option value="Other">Other</option>

                            </select>

                        </div>

                        <div className="flex flex-col gap-2">

                            <label className=" block font-semibold">
                                Message
                            </label>

                            <textarea
                                rows={7}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your message..."
                                maxLength={1000}
                                className="w-full border border-slate-300 rounded-lg p-3 pb-16 resize-none focus:outline-none"
                            />

                            <div className="flex justify-end mt-1">
                                <span className ="text-right text-sm text-slate-400px-1 pointer-events-none">
                                    {message.length}/1000
                                </span>
                            </div>

                        </div>

                        <div className="flex justify-start items-start bg-blue-100 gap-4 px-4 py-2 rounded-lg">
                            
                            < LuInfo className="text-blue-700 font-bold text-3xl"/>

                            <div className="text-sm text-blue-700">
                                Your message will be sent from your registered email{" "}
                                <span className="font-bold text-blue-700">{user?.email}</span> 
                                {" "}to the portfolio manager.
                            </div>

                        </div>

                        <div className="flex justify-between items-center">
                            
                            <button 
                                onClick={handleClose}
                                className="px-6 py-2 border border-primary rounded-lg text-slate-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-600 hover-shadow-sm active:scale-[0.98">
                                Cancel
                            </button>

                            <button 
                                onClick={sendMessage}
                                className="px-6 py-2 rounded-lg flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700">
                                <FaPaperPlane />
                                Send Messsage
                            </button>

                        </div>

                    </div>

            )}

            { view=== "loading" && (
                
                <div className="flex flex-col bg-white p-8 rounded-lg w-[550px] gap-6 h-[750px]">
                
                    <div className="flex justify-between items-center">
                        
                        <h1 className="font-bold text-xl">Contact Portfolio Manager</h1>

                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-16 gap-5">

                        <div className="rounded-full bg-blue-100 p-4 flex items-center justify-center">
                            < LuLoaderCircle className="text-5xl text-blue-700 animate-spin"/>
                        </div>

                        <div className="flex flex-col justify-center items-center text-center space-y-2 gap-3">
                            <h2 className="text-2xl font-semibold">Sending your message... </h2>
                            <h2 className="text-zinc-500 max-w-sm">Please wait while we securely deliver your request to the portfolio manager.</h2>
                        </div>

                    </div>

                </div>
                
            )}

            { view=== "success" && (
                    <div className="flex flex-col bg-white p-8 rounded-lg w-[550px] gap-6 h-[750px]">
                        
                        <div className="flex justify-between items-center bg-white rounded-lg">
                            
                            <h1 className="font-bold text-xl">Contact Portfolio Manager</h1>

                            <button 
                                onClick={onClose}
                                className="text-2xl"
                            >
                                    <RxCross2 />
                            </button>

                        </div>

                        <div className="flex flex-col items-center mt-8">
                            <div className="w-24 h-24 rounded-full bg-green-100 border border-green-100 flex items-center justify-center animate-[pop_.45s]">
                                <FaCheck className="text-green-600 text-5xl"/>
                            </div>

                            <h2 className="text-2xl font-semibold mt-6">
                                Request Submitted
                            </h2>

                            <p className="text-zinc-500 text-center mt-2 max-w-sm">
                                Your message has been securely delivered to your portfolio manager.
                            </p>
                        </div>

                        <div className="bg-green-50 border border-green-100 rounded-xl mt-8 overflow-hidden">
                            
                            {/* Row 1 */}
                            <div className="grid grid-cols-[40px_170px_220px] items-center px-6 py-5 border-b border-green-100">

                                <LuClock3 className="text-2xl text-green-600"/>

                                <p className="ml-6 flex-1 font-medium">
                                    Expected Response
                                </p>

                                <p className="font-semibold text-green-600">
                                    Within 24 Hours
                                </p>

                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-[40px_170px_220px] items-center px-6 py-5">

                                <LuBell className="text-2xl text-green-600"/>

                                <p className="ml-6 flex-1 font-medium">
                                    Notification
                                </p>

                                <p className="text-zinc-500 text-left">
                                    You will receive an email
                                    <br/>
                                    when your manager replies.
                                </p>

                            </div>

                        </div>

                        <div className="flex gap-3 mt-8">

                            <button
                                onClick={()=>{
                                    setMessage("");
                                    setSubject("Portfolio Support");
                                    setView("form");
                                }}
                                className="flex-1 border rounded-lg py-3 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 hover-shadow-sm active:scale-[0.98] transition"
                            >
                                Submit Another Query
                            </button>

                            <button
                                onClick={handleClose}
                                className="flex-1 bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition"
                            >
                                Done
                            </button>

                        </div>

                    </div>

            )}

            { view=== "error" && (
                <div className="flex flex-col bg-white p-8 rounded-lg w-[550px] gap-6 h-[750px]">
                        
                        <div className="flex justify-between items-center bg-white rounded-lg">
                            
                            <h1 className="font-bold text-xl">Contact Portfolio Manager</h1>
                            <button 
                                onClick={onClose}
                                className="text-2xl"
                            >
                                    <RxCross2 />
                            </button>

                        </div>

                        <div className="flex flex-col items-center mt-8">

                            <div className="w-24 h-24 rounded-full bg-red-100 border border-red-100 flex items-center justify-center animate-[pop_.45s]">
                                <FaXmark className="text-red-600 text-5xl"/>
                            </div>

                            <h2 className="text-2xl font-semibold mt-6">
                                Unable to Send Message
                            </h2>

                            <p className="text-zinc-500 text-center mt-2 max-w-sm">
                                Something went wrong while sending your message.
                                <br />
                                Please try again.
                            </p>

                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-xl mt-8 overflow-hidden">

                            {/* Row 1 */}
                            <div className="grid grid-cols-[40px_170px_220px] items-center px-6 py-5 border-b border-red-100">

                                <LuWifi className="text-2xl text-red-600"/>

                                <p className="font-medium">
                                    Check your connection
                                </p>

                                <p className="text-zinc-500 text-left">
                                    Please check your
                                    <br/>
                                    internet connection
                                </p>

                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-[40px_170px_220px] items-center px-6 py-5">

                                <LuClock3 className="text-2xl text-red-600"/>

                                <p className="font-medium">
                                    Try again later
                                </p>

                                <p className="text-zinc-500 text-left">
                                    If the problem persists, please 
                                    <br/>
                                    try again in a few minutes.
                                </p>

                            </div>

                        </div>

                        <div className="flex gap-3 mt-8">

                            <button
                                onClick={handleClose}
                                className="flex-1 border rounded-lg py-3 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 hover-shadow-sm active:scale-[0.98] transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={()=>{
                                    setMessage("");
                                    setSubject("Portfolio Support");
                                    setView("form");
                                }}
                                className="flex-1 bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition"
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

            )}

        </div>
    );

}