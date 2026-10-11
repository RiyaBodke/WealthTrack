import { LuNotepadText } from "react-icons/lu"
import { FaPen } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

export function Notes({ title, notes, time, onClick }){

    function getUpdatedTime(time) {

        if (!time) return "0 min";

        const updated = new Date(time);
        const now = new Date();

        const difference = now - updated;

        const minutes = Math.floor(difference / (1000 * 60));

        // Less than 1 hour
        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours = Math.floor(minutes / 60);

        // Less than 24 hours
        if (hours < 24) {
            return `${hours} h`;
        }

        const days = Math.floor(hours / 24);

        // 24 hours or more
        return `${days} day${days !== 1 ? "s" : ""}`;
    }
    const last_updated =getUpdatedTime(time);
    
    const {user} = useUser();

    return(
        <div className="flex flex-col gap-2 bg-blue-600 rounded-lg h-52 p-4" >
            
            {/* Quick Trader Notes */}
                <div className="flex justify-between items-center">
                
                    <div className="flex justify-center items-center bg-blue-back/15 rounded-full px-2 py-1.5 gap-1">                                                  {/* Blue Background */}
                        <LuNotepadText className="text-white"></LuNotepadText>                                                                                      {/* Notepad Icon */}
                        <h6 className="text-xs font-extrabold text-white">Quick Trader Notes</h6>                                                                   {/* Title */}
                    </div>

                    <div className="flex gap-2 items-center justify-between">
                        
                        
                        <p className="text-white text-xs">Updated {last_updated} ago</p>
                        
                        
                        { user?.role == "admin" && (
                            <button 
                                onClick={onClick}
                                className=" flex bg-blue-back/15 text-white py-1 px-2 rounded-md backdrop-blur-sm items-center
                                            hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-blue-950/20 transition-all duration-200 ease-out
                                            active:translate-y-0 active:scale-95">
                                
                                <TbEdit className="text-xl"/>
                                <h1 className="text-xs"></h1>
                            </button>
                        )}

                    </div>                                                                                          {/* Updated Time */}

            </div>

            <div className="flex flex-col gap-3">
                
                <h6 className="text-white text-base font-bold pt-3 pl-3">{title}</h6>

                <p className="text-white text-xs pl-3">
                    {notes}
                </p>

            </div>
        </div>
    )
}

export function EditNotes({isOpen, onClose, initialTitle, initialNotes}){

    const [title, setTitle] = useState(initialTitle || "");
    const [notes, setNotes] = useState(initialNotes || "");

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle || "");
            setNotes(initialNotes || "");
        }
    }, [isOpen, initialTitle, initialNotes]);


    if(!isOpen) return null;
    
    const handleClose = () => {

        setTitle("");
        setNotes("");
        onClose();
    };

    const handleSave = async () => {
        try {
            
            const response = await fetch(
                "http://localhost:8000/api/trader-notes",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                        notes: notes.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save notes");
            }

            console.log("Note saved:", data);
            onClose();

        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    return(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            
            <div className="flex flex-col bg-white p-6 rounded-lg w-[600px] gap-6 h-[500px]">
                
                <div className="flex justify-between items-start bg-white rounded-lg">
            
                    <div className="flex flex-col gap-2 ">
                        <h1 className="font-bold text-xl">Edit Quick Traders Notes</h1>
                        <h1 className="text-zinc-400 text-sm">Update the notes that are visible to clients.</h1>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="text-2xl"
                    >
                        <RxCross2 />
                    </button>
                
                </div>

                <div>
                    <div className="flex flex-col gap-2">

                        <label className=" block font-semibold">
                                Title
                        </label>

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Write your Title..."
                            maxLength={80}
                            className="w-full border border-slate-300 rounded-lg p-3 resize-none focus:outline-none"
                        />

                        <div className="flex justify-end mt-1">
                            <span className ="text-right text-sm text-slate-400px-1 pointer-events-none text-zinc-600/80">
                                {title.length}/80
                            </span>
                        </div>

                    </div>

                    <div className="flex flex-col gap-2">

                        <label className=" block font-semibold">
                                Notes
                        </label>

                        <textarea
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Write your Message..."
                            maxLength={200}
                            className="w-full border border-slate-300 rounded-lg p-3 resize-none focus:outline-none"
                        />

                        <div className="flex justify-end mt-1">
                            <span className ="text-right text-sm text-slate-400px-1 pointer-events-none text-zinc-600/80">
                                {notes.length}/200
                            </span>
                        </div>

                    </div>
                </div>

                <div className="flex justify-between items-center">
                                            
                    <button 
                        onClick={handleClose}
                        className="px-6 py-2 border border-primary rounded-lg text-slate-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-600 hover-shadow-sm active:scale-[0.98"
                    >
                        Cancel
                    </button>
                
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg flex items-center gap-2 text-white bg-primary hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                
                </div>

            </div>
            
        </div>
    )
}