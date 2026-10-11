import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/navbar";
import { Sidebar } from "../../components/sidebar";

export default function AppLayout()
{
    return(
        <div className="min-h-[calc(100vh-4rem)]">

            < Sidebar />

            <main className="ml-60 min-w-0">

                <Navbar />
                
                <div className="px-6">
                    <Outlet />
                </div>
            </main>
            
        </div>
    )
}