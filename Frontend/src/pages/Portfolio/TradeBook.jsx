import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { user } from "../../data/user"
import { useUser } from "../../context/UserContext"

import { getTradeBook } from "../../api/tradeBook";

// COMPONENET IMPORT
import { TradeBookTable } from "../../components/tables"
import { Add, SearchBar, SortBy } from "../../components/button"
import Footer from "../../components/footer"

export default function TradeBook() {

    const { user, loading } = useUser();

    const [holdings, setHoldings] = useState([]);
    const [loadingHoldings, setLoadingHoldings] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredHoldings = holdings.filter((holding) => {

        const search = searchTerm.toLowerCase();

        return (
            holding.company_name?.toLowerCase().includes(search) ||
            holding.ticker?.toLowerCase().includes(search)
        );

    });

    const [sortBy, setSortBy] = useState("date-desc");
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
    const sortedHoldings = [...filteredHoldings].sort((a, b) => {

        switch (sortBy) {

            case "date-desc":
                return new Date(b.buy_date) - new Date(a.buy_date);

            case "date-asc":
                return new Date(a.buy_date) - new Date(b.buy_date);

            case "profit-desc": {
                const quantityA = Number(a.quantity)

                const quantityB = Number(b.quantity)

                const profitA =
                    quantityA *
                    (Number(a.current_price) - Number(a.buy_price));

                const profitB =
                    quantityB *
                    (Number(b.current_price) - Number(b.buy_price));

                return profitB - profitA;
            }

            case "profit-asc": {
                const quantityA = Number(a.quantity)

                const quantityB = Number(b.quantity)

                const profitA =
                    quantityA *
                    (Number(a.current_price) - Number(a.buy_price));

                const profitB =
                    quantityB *
                    (Number(b.current_price) - Number(b.buy_price));

                return profitA - profitB;
            }

            case "name-asc":
                return a.company_name.localeCompare(b.company_name);

            default:
                return 0;
        }
    });

    const navigate = useNavigate();

    useEffect(() => {

        if (!user) {
            return;
        }

        async function loadTradeBook() {

            try {

                const data = await getTradeBook();

                console.log("TradeBook API:", data);

                setHoldings(data.holdings || []);

            } catch (error) {

                console.error("TradeBook Error:", error);

                setHoldings([]);

            } finally {

                setLoadingHoldings(false);

            }

        }

        loadTradeBook();

    }, [user]);


    if (loading) {
        return <div>Loading...</div>;
    }


    if (!user) {
        return null;
    }


    if (loadingHoldings) {
        return <div>Loading holdings...</div>;
    }

    return(
        <div className="flex flex-col bg-transparent gap-4">

            <div className="flex flex-col">

                <h2 className=" text-xs md:text-lg">Current Portfolio Value</h2>

                <span className="flex place-items-baseline gap-3">
                    <h2 className=" font-black md:text-2xl">₹51,383.20</h2>
                    <h4 className=" font-extrabold md:text-sm text-green-600">+ ₹ 700 (2.77%)</h4>
                </span>

            </div>

            <div className="flex justify-between w-full items-baseline">

                <SearchBar 
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search holdings"
                />

                <span className="flex gap-2">
                    
                    { user.role === "admin" && 
                        <Add 
                            onClick = {() => navigate("/portfolio/holdings/add-trade")}
                            name="Trade" 
                        />
                    }
                    
                    <SortBy
                        value={sortBy}
                        onChange={setSortBy}
                        options={sortOptions}
                    />

                </span>
            </div>

            < TradeBookTable 
                holdings={sortedHoldings}
                role={user.role}
            />
        </div>
    )
}