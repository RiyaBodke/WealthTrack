import { useState, useEffect } from "react";

import { useUser } from "../../context/UserContext";

// COMPONENTS IMPORT
import Footer from "../../components/footer";
import { EditNotes } from "../../components/notes";
import { CurrentValueCard, NetProfitCard, NiftySensexCard, PortfolioAmountCard, ProfitSharingCard, ProfitCard } from "../../components/cards";
import { Notes } from "../../components/notes";
import { LineChart, PieChart } from "../../components/chart";
import { TopEquityHoldings } from "../../components/tables";
import { Chat } from "../../components/button";
import { ContactModal } from "../../components/ContactManager/ContactModal"

export default function Dashboard()
{

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const {user} = useUser();

    const [showEditNotes, setShowEditNotes] = useState(false);

    const [noteData, setNoteData] = useState("");

    useEffect(() => {
        async function getNotes() {
            const response = await fetch("http://localhost:8000/api/trader-notes");
            const data = await response.json();

            setNoteData(data.note);

        }

        getNotes();
    }, []);

    return (
        // <div className="bg-white min-h-screen min-w flex items-center justify-center md:bg-transparent">
            <div className=" bg-transparent rounded-3xl md:rounded-none mb-5">

                <div className="grid grid-cols-6 gap-4 ">

                    {/* <div className="col-span-6 flex flex-col">  */}
                        {/* <h3 className=" text-base md:text-xl font-bold">Dashboard</h3>                                  Page Heading Display */}
                        {/* <h4 className=" md:text-sm font-medium">Track financial activity and portfolio analytics</h4> */}
                    {/* </div> */}

                    <div  className="col-span-6 grid grid-cols-6 gap-3" >
                    
                        <NiftySensexCard className="col-span-1" />

                        <PortfolioAmountCard className="col-span-1" />

                        <CurrentValueCard className="col-span-1" />

                        <NetProfitCard className="col-span-1" />

                        <ProfitCard className="col-span-1" />

                        <ProfitSharingCard className="col-span-1" />

                    </div>

                    <div className="col-span-4 flex flex-col gap-4">
                        
                        <LineChart />

                        <TopEquityHoldings />

                    </div>
                    
                    <div className="col-span-2 flex flex-col gap-4">
                        
                        <Notes 
                            title={noteData.title}
                            notes={noteData.notes}
                            time={noteData.updated_at}
                            onClick={ () => setShowEditNotes(true)} >
                        </Notes>

                        { user?.role == "admin" && (
                            < EditNotes 
                                isOpen={showEditNotes}
                                onClose = {() => setShowEditNotes(false)}
                                initialTitle={noteData.title}
                                initialNotes={noteData.notes}
                            />
                        )}
                        
                        <PieChart></PieChart>

                        <Chat 
                            onClick={ () => setIsContactModalOpen(true) }
                        ></Chat>

                    </div>

                </div>

                <ContactModal
                    isOpen={isContactModalOpen}
                    onClose={() => setIsContactModalOpen(false)}
                    user={user}
                />

            </div>

        // </div>
    )
}