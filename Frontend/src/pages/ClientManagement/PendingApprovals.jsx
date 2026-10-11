// ICONS IMPORT
import { LuDot, LuUserPlus } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";

// COMPONENTS IMPORT
import { PendingApprovalsTable } from "../../components/tables";
import { SearchBar, Approve, Reject } from "../../components/button";

export default function PendingApprovals(){
    return(
        <div className="flex flex-col bg-transparent gap-6">
        
            <div className="flex justify-between items-center w-full bg-blue-300 h-16 p-4 rounded-lg">

                <span className="flex justify-between items-center gap-3">

                    <span className="p-1 bg-white rounded-lg">

                        <LuUserPlus  className="text-4xl"/>

                    </span>

                    <span className="flex items-center">

                        <h3 className="font-extrabold">5 Pending Requests</h3>

                        <LuDot className="text-4xl"/>

                        <h3>Requires Actions</h3>

                    </span>

                </span>

                <span className="flex justify-between items-center gap-4">

                    <FiCheckCircle />
                    
                    <SearchBar />

                </span>

            </div>

            < PendingApprovalsTable />
        
        </div>
    )
}