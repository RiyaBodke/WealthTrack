import { useEffect, useState } from "react";

import { useUser } from "../../context/UserContext";

// FUNCTIONS IMPORT
import { getHistory } from "../../api/history";
import { getDateInfo } from "../../utils/date";
import { getFinancialYear } from "../../utils/financialYear";

// COMPONENTS IMPORT
import { HistoryTable } from "../../components/tables"
import Footer from "../../components/footer"
import { ExportReport, FinancialYear, Quarter, SortBy } from "../../components/button"

export default function History(){

    const { user, loading } = useUser();

    const [trades, setTrades] = useState([]);
    const [loadingTrades, setLoadingTrades] = useState(true);

    const [financialYear, setFinancialYear] = useState("2025-26");
    const [quarter, setQuarter] = useState("all");

    const financialYearOptions = [
        ...new Set(
            trades.map((trade) =>
                getFinancialYear(trade.sell_date)
            )
        )
    ];

    const sortOptions = [
        {
            value: "date-desc",
            label: "Latest"
        },
        {
            value: "date-asc",
            label: "Oldest"
        },
        {
            value: "profit-desc",
            label: "Highest Profit"
        },
        {
            value: "profit-asc",
            label: "Lowest Profit"
        },
        {
            value: "name-asc",
            label: "Company Name"
        }
    ];

    const [sortBy, setSortBy] = useState("date-desc");

    const sortedTrades = [...trades].sort((a, b) => {

        switch (sortBy) {

            case "date-desc":
                return new Date(b.sell_date) - new Date(a.sell_date);

            case "date-asc":
                return new Date(a.sell_date) - new Date(b.sell_date);

            case "profit-desc": {

                const profitA =
                    Number(a.quantity) *
                    (
                        Number(a.sell_price) -
                        Number(a.buy_price)
                    );

                const profitB =
                    Number(b.quantity) *
                    (
                        Number(b.sell_price) -
                        Number(b.buy_price)
                    );

                return profitB - profitA;
            }

            case "profit-asc": {

                const profitA =
                    Number(a.quantity) *
                    (
                        Number(a.sell_price) -
                        Number(a.buy_price)
                    );

                const profitB =
                    Number(b.quantity) *
                    (
                        Number(b.sell_price) -
                        Number(b.buy_price)
                    );

                return profitA - profitB;
            }

            case "name-asc":
                return a.company_name.localeCompare(b.company_name);

            default:
                return 0;
        }

    });

    useEffect(() => {

        if (!user) {
            return;
        }

        async function loadHistory() {

            try {

                const data = await getHistory(
                    financialYear,
                    quarter
                );

                setTrades(data.history || []);

            } catch (error) {

                console.error("History Error:", error);

                setTrades([]);

            } finally {

                setLoadingTrades(false);

            }

        }

        loadHistory();

    }, [user, financialYear, quarter]);

    if (loading) {
        return <div>Loading...</div>;
    }


    if (!user) {
        return null;
    }


    if (loadingTrades) {
        return <div>Loading holdings...</div>;
    }

    return(
        <div className="flex flex-col bg-transparent gap-4">

            <div className="flex flex-col">

                <h2 className=" text-xs md:text-lg">Total Portfolio Value</h2>

                <span className="flex place-items-baseline gap-3">
                    <h2 className=" font-black md:text-2xl">₹51,383.20</h2>
                    <h4 className=" font-extrabold md:text-sm text-green-600">+ ₹1,383 (2.77%)</h4>
                </span>

            </div>

            <div className="flex justify-between items-baseline">
                
                <span className="flex gap-3">
                    
                    <FinancialYear 
                        value = {financialYear}
                        onChange = {setFinancialYear}
                        options= {financialYearOptions}
                    />

                    <Quarter 
                        value={quarter}
                        onChange={setQuarter}
                    />
                    
                </span>

                <span className="flex gap-3">
                    
                    <SortBy 
                        value={sortBy}
                        onChange={setSortBy}
                        options={sortOptions}
                    />

                    <ExportReport />

                </span>
            </div>

            <HistoryTable 
                trades={sortedTrades}
            />
        </div>
    )
}