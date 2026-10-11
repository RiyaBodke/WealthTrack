// COMPONENTS IMPORT
import Footer from "../../components/footer"
import { CurrentValueCard, NetProfitCard, NiftySensexCard, PortfolioAmountCard, ProfitSharingCard, ProfitCard, ClientInfoCard } from "../../components/cards"
import { Notes } from "../../components/notes"
import { LineChart, PieChart } from "../../components/chart"
import { EquityHoldings } from "../../components/tables"
import { Chat, Delete } from "../../components/button"

export default function ClientDetails(){
    return(
        <div className="bg-transparent rounded-3xl md:rounded-none mb-5">

            <div className=" grid grid-cols-6 gap-5 ">
        
                <div className="col-span-6 grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",}}>

                    <ClientInfoCard />
                        
                    <PortfolioAmountCard />

                    <CurrentValueCard className="col-span-1" />

                    <NetProfitCard className="col-span-1" />

                    <ProfitSharingCard className="col-span-1" />

                </div>
                
                <div className="col-span-4 flex flex-col gap-5">

                    <LineChart />
            
                </div>

                <div className="col-span-2 flex flex-col gap-5">
        
                    <PieChart />
            
                    <Chat />
            
                </div>

                <div className="col-span-6 flex flex-col">
                    <EquityHoldings />
                </div>

                <div  className="col-span-6 flex flex-col">
                    <Footer />
                </div>
            
            </div>

        </div>
    )
}