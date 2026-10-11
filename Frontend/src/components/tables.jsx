import { LuArrowRight, LuChartCandlestick, LuChartNoAxesCombined, LuEye, LuMail, LuReceiptText } from "react-icons/lu"
import { Link, useNavigate } from "react-router-dom"
import { Approve, Reject } from "./button";
import { getDateInfo } from "../utils/date";

export function TopEquityHoldings(){

    const navigate = useNavigate();

    return(
        <div className="bg-white h-52 rounded-2xl p-6">
            <h3 className="text-primary font-bold text-base">Top Equity Holdings</h3>

            <table className="w-full bg-white overflow-hidden my-4 py-2">
                <thead>
                    <tr className="bg-[#C6D9F9] text-sm font-semibold">
                        <td className="px-4 py-1 rounded-l-lg ">Company</td>
                        <td>Sector</td>
                        <td>Qnty</td>
                        <td>Buy Price</td>
                        <td>Current Price</td>
                        <td>Invested Amount</td>
                        <td className="px-4 py-1 rounded-r-lg ">Net Position</td>
                    </tr>
                </thead>

                <tbody>
                    <tr className="text-sm border-b  border-slate-300">
                        <td className="px-4 py-1">JSW Steel LTD</td>
                        <td>Energy</td>
                        <td>12</td>
                        <td>₹ 1125.70</td>
                        <td>₹ 1281.00</td>
                        <td>₹ 13508.40</td>
                        <td>₹ 1863.60</td>
                    </tr>

                    <tr className="text-sm border-b border-slate-300">
                        <td className="px-4 py-1">JSW Steel LTD</td>
                        <td>Energy</td>
                        <td>12</td>
                        <td>₹ 1125.70</td>
                        <td>₹ 1281.00</td>
                        <td>₹ 13508.40</td>
                        <td>₹ 1863.60</td>
                    </tr>
                </tbody>
                
            </table>

            <div onClick={() => navigate("/portfolio/holdings")} className="flex items-center justify-end text-blue-600 font-semibold cursor-pointer">
                <h6>View All</h6>
                <LuArrowRight />
            </div>
        </div>
    )
}

import { useState } from "react";
import { ResponsiveContainer, Area, AreaChart, XAxis, YAxis, Tooltip } from "recharts";

export function TradeBookTable({ holdings = [], role }) {

    const isAdmin = role === "admin";

    const [expandedTrade, setExpandedTrade] = useState(null);

    const [chartData, setChartData] = useState([]);
    const [chartRange, setChartRange] = useState("1M");
    const [chartLoading, setChartLoading] = useState(false);
    const [chartLastUpdated, setChartLastUpdated] = useState(null);

    const chartPositive =
        chartData.length >= 2 &&
        Number(chartData[chartData.length - 1].price) >=
        Number(chartData[0].price);

    const chartColor = chartPositive ? "#16a34a" : "#ef4444";

    const loadChartData = async (ticker, range) => {

        try {

            setChartLoading(true);

            const response = await fetch(
                `http://localhost:8000/api/market-data/${ticker}?range=${range}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch chart data");
            }

            const data = await response.json();

console.log("========== CHART DEBUG ==========");
console.log("Requested range:", range);
console.log("Number of points:", data.data?.length);
console.log("First point:", data.data?.[0]);
console.log("Last point:", data.data?.[data.data.length - 1]);
console.log("Last 3 points:", data.data?.slice(-3));
console.log("=================================");

setChartData(data.data || []);

            setChartData(data.data || []);
            setChartLastUpdated(data.lastUpdated || null);

        } catch (error) {

            console.error("Chart data error:", error);
            setChartData([]);

        } finally {

            setChartLoading(false);

        }
    };

    const formatChartTime = (value) => {

    const info = getDateInfo(value);

        if (chartRange === "1D") {

            const hour = info.hours % 12 || 12;
            const period = info.hours >= 12 ? "PM" : "AM";

            return `${hour}:${String(info.minutes).padStart(2, "0")} ${period}`;
        }

        if (chartRange === "1W") {

            return info.dayName.slice(0, 3);
        }

        if (chartRange === "1M") {

            return `${info.monthName.slice(0, 3)} ${info.date}`;
        }

        if (chartRange === "6M" || chartRange === "1Y") {

            return info.monthName.slice(0, 3);
        }

        if (chartRange === "5Y") {

            return String(info.year);
        }

        return "";
    };

    const CustomTooltip = ({ active, payload }) => {

        if (!active || !payload || !payload.length) {
            return null;
        }

        const point = payload[0];
        const info = getDateInfo(point.payload.time);

        const hour = info.hours % 12 || 12;
        const period = info.hours >= 12 ? "PM" : "AM";

        return (
            <div 
                className="rounded-lg px-2.5 py-1.5 shadow-lg border border-white/10 backdrop-blur-sm"
                style={{
                    backgroundColor: "rgba(71, 85, 79, 0.72)"
                }}
            >

                <p className="text-[9px] text-slate-100 leading-tight">
                    {info.date} {info.monthName.slice(0, 3)} {info.year}
                    {chartRange === "1D" &&
                        ` · ${hour}:${String(info.minutes).padStart(2, "0")} ${period}`
                    }
                </p>

                <p
                    className="text-[11px] font-semibold leading-tight mt-0.5 text-white"
                >
                    ₹{Number(point.value).toFixed(2)}
                </p>

            </div>
        );
    };

    return (
        <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[850px] table-fixed py-2">

                <colgroup>
                    <col className="w-[36%]" />
                    <col className="w-[16%]" />
                    <col className="w-[16%]" />
                    <col className="w-[16%]" />
                    <col className="w-[16%]" />
                </colgroup>

                <thead className="sticky top-0 z-30 text-left">

                    <tr className="bg-[#e4eeff] font-semibold">

                        <th className="px-4 py-4 rounded-tl-lg">
                            Company
                        </th>

                        <th>
                            Quantity
                        </th>

                        <th>
                            Buy Price
                        </th>

                        <th>
                            Current Price
                        </th>

                        <th className="px-4 py-4 rounded-tr-lg">
                            Net Profit
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {holdings.length === 0 ? (

                        <tr>

                            <td colSpan="6">

                                <div className="flex flex-col items-center justify-center py-12 text-center">

                                    <div className="font-semibold text-slate-600">
                                        No holdings found
                                    </div>

                                    <div className="text-sm text-slate-400 mt-1">
                                        Try searching for a different company or ticker.
                                    </div>

                                </div>

                            </td>

                        </tr>

                    ) : (

                        holdings.map((holding) => {

                            const isExpanded =
                                expandedTrade === holding.holding_id;

                            const quantity =
                                Number(holding.quantity || 0);

                            const buyPrice =
                                Number(holding.buy_price || 0);

                            const currentPrice =
                                Number(holding.current_price || 0);

                            const sellPrice =
                                Number(holding.sell_price || 0);

                            const isClosed =
                                holding.status?.toUpperCase() === "CLOSED";

                            const profit = isClosed
                                ? quantity * (sellPrice - buyPrice)
                                : quantity * (currentPrice - buyPrice);

                            const investedAmount =
                                quantity * buyPrice;

                            const currentValue =
                                isClosed
                                    ? quantity * sellPrice
                                    : quantity * currentPrice;

                            const returnPercentage =
                                investedAmount > 0
                                    ? (profit / investedAmount) * 100
                                    : 0;


                            return (
                                <>

                                    {/* ================= MAIN TRADE ROW ================= */}

                                    <tr
                                        key={holding.holding_id}
                                        onClick={() => {

                                            const willExpand = !isExpanded;

                                            setExpandedTrade(
                                                willExpand ? holding.holding_id : null
                                            );

                                            if (willExpand) {
                                                setChartRange("1M");
                                                loadChartData(holding.ticker, "1M");
                                            }

                                        }}
                                        className={`
                                            cursor-pointer
                                            transition-colors
                                            
                                            ${
                                                isExpanded
                                                    ? "bg-[#dceaff]"
                                                    : "bg-white hover:bg-slate-50"
                                            }
                                        `}
                                    >

                                        {/* COMPANY */}

                                        <td 
                                            colSpan={isExpanded ? 6 : 1}
                                            className="px-4 py-4"
                                        >

                                            <div className="flex items-center gap-3 min-w-0">

                                                <span className="shrink-0 w-9 h-9 rounded-full bg-[#9ab9ee] flex items-center justify-center overflow-hidden">

                                                    <img
                                                        src={holding.logo_url}
                                                        alt={holding.company_name}
                                                        className="w-full h-full object-contain"
                                                    />

                                                </span>

                                                <div className="min-w-0">

                                                    <div className="font-bold truncate">
                                                        {holding.company_name}
                                                    </div>

                                                    <div className="text-[11px] text-slate-400">
                                                        {holding.ticker}
                                                    </div>

                                                </div>

                                            </div>

                                        </td>

                                        {!isExpanded && (
                                            <>
                                                
                                                {/* QUANTITY */}

                                                <td >
                                                    {quantity}
                                                </td>


                                                {/* BUY PRICE */}

                                                <td>
                                                    ₹ {buyPrice.toFixed(2)}
                                                </td>


                                                {/* CURRENT / SELL PRICE */}

                                                <td>
                                                    ₹ {
                                                        isClosed
                                                            ? sellPrice.toFixed(2)
                                                            : currentPrice.toFixed(2)
                                                    }
                                                </td>


                                                {/* PROFIT */}

                                                <td
                                                    className={`
                                                        font-bold
                                                        ${
                                                            profit >= 0
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    `}
                                                >
                                                    ₹ {profit.toFixed(2)}
                                                </td>

                                            </>
                                        )}

                                    </tr>

                                    {/* ================= EXPANDED TRADE DETAILS ================= */}

{isExpanded && (

    <tr key={`${holding.holding_id}-details`}>

        <td
            colSpan="6"
            className="bg-[#dceaff] px-4 pt-3 pb-4"
        >

            {/* ================= THREE CARDS ================= */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">


                {/* ================= TRADE OVERVIEW ================= */}

                <div className="bg-white rounded-xl border border-slate-200 p-5">

                    <div className="flex items-center gap-2 mb-5">

                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            < LuReceiptText className="w-6 h-6 font-semibold" />
                        </div>

                        <h3 className="font-bold text-sm text-slate-800">
                            Trade Overview
                        </h3>

                    </div>


                <div className="grid grid-cols-[90px_1fr] gap-x-4 gap-y-5 items-center">

                        <span className="text-sm text-slate-500">
                            Company
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                            {holding.company_name}
                        </span>


                        <span className="text-sm text-slate-500">
                            Symbol
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                            {holding.ticker || "—"}
                        </span>


                        <span className="text-sm text-slate-500">
                            Buy Date
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                            {holding.buy_date
                                ? new Date(holding.buy_date).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    }
                                )
                                : "—"
                            }
                        </span>


                        <span className="text-sm text-slate-500">
                            Buy Price
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                            ₹ {buyPrice.toFixed(2)}
                        </span>


                        <span className="text-sm text-slate-500">
                            Quantity
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                            {quantity}
                        </span>


                        <span className="text-sm text-slate-500">
                            Invested
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                            ₹ {investedAmount.toFixed(2)}
                        </span>


                        <span className="text-sm text-slate-500">
                            Status
                        </span>

                        <span
                            className={`
                                w-fit
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                ${
                                    isClosed
                                        ? "bg-slate-200 text-slate-600"
                                        : "bg-green-300 text-[#0c5b43]"
                                }
                            `}
                        >
                            {holding.status}
                        </span>

                    </div>

                </div>



                {/* ================= PERFORMANCE ================= */}

                <div className="bg-white rounded-xl border border-slate-200 p-5">

                    <div className="flex items-center gap-2 mb-5">

                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            < LuChartNoAxesCombined className="w-6 h-6 font-semibold" />
                        </div>

                        <h3 className="font-bold text-sm text-slate-800">
                            Performance
                        </h3>

                    </div>


                    <div className="space-y-4">

                        <div className="flex justify-between items-center">

                            <span className="text-xs text-slate-500">
                                {isClosed
                                    ? "Sell Price"
                                    : "Current Price"
                                }
                            </span>

                            <span className="text-sm font-bold text-slate-800">
                                ₹ {
                                    isClosed
                                        ? sellPrice.toFixed(2)
                                        : currentPrice.toFixed(2)
                                }
                            </span>

                        </div>


                        <div className="flex justify-between items-center">

                            <span className="text-xs text-slate-500">
                                {isClosed
                                    ? "Realized Invested Value"
                                    : "Current Invested Value"
                                }
                            </span>

                            <span className="text-sm font-bold text-slate-800">
                                ₹ {currentValue.toFixed(2)}
                            </span>

                        </div>


                        <div className="flex justify-between items-center">

                            <span className="text-xs text-slate-500">
                                {isClosed
                                    ? "Realized P/L"
                                    : "Unrealized P/L"
                                }
                            </span>

                            <span
                                className={`
                                    text-sm
                                    font-bold
                                    ${
                                        profit >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                `}
                            >
                                ₹ {profit.toFixed(2)}
                            </span>

                        </div>


                        <div className="flex justify-between items-center">

                            <span className="text-xs text-slate-500">
                                Day Change
                            </span>

                            <span className="text-sm font-semibold text-slate-800">
                                0.00%
                            </span>

                        </div>


                        <div className="flex justify-between items-center">

                            <span className="text-xs text-slate-500">
                                52 Week High
                            </span>

                            <span className="text-sm font-semibold text-slate-800">
                                ₹ 1,890.00
                            </span>

                        </div>


                        <div className="flex justify-between items-center">

                            <span className="text-xs text-slate-500">
                                52 Week Low
                            </span>

                            <span className="text-sm font-semibold text-slate-800">
                                ₹ 620.35
                            </span>

                        </div>


                        <div className="flex justify-between items-center">

                            <span className="text-xs text-slate-500">
                                Return %
                            </span>

                            <span
                                className={`
                                    text-sm
                                    font-bold
                                    ${
                                        returnPercentage >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                `}
                            >
                                {returnPercentage >= 0 ? "+" : ""}
                                {returnPercentage.toFixed(2)}%
                            </span>

                        </div>


                        {isClosed && (

                            <div className="flex justify-between items-center">

                                <span className="text-xs text-slate-500">
                                    Sell Date
                                </span>

                                <span className="text-sm font-semibold">
                                    {holding.sell_date
                                        ? new Date(
                                            holding.sell_date
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )
                                        : "—"
                                    }
                                </span>

                            </div>

                        )}

                    </div>

                </div>



                {/* ================= PRICE TREND ================= */}

                <div className="bg-white rounded-xl border border-slate-200 p-5">

                    <div className="flex items-center justify-between mb-4">

                        <div className="flex items-center gap-2">

                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                < LuChartCandlestick className="w-6 h-6 font-semibold"/>
                            </div>

                            <h3 className="font-bold text-sm text-slate-800">
                                Price Trend
                            </h3>

                            <span className="text-xs text-slate-400">
                                (NSE)
                            </span>

                        </div>


                        <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">

                            <span className="w-2 h-2 rounded-full bg-green-500" />

                            Live

                        </div>

                    </div>


                    {/* GRAPH PLACEHOLDER */}

                    <div className="h-[190px] w-full min-w-0 rounded-lg bg-slate-50 border border-slate-100 outline-none">

    {chartLoading ? (

        <div className="h-full flex items-center justify-center">
            <span className="text-xs text-slate-400">
                Loading price data...
            </span>
        </div>

    ) : chartData.length === 0 ? (

        <div className="h-full flex items-center justify-center">
            <span className="text-xs text-slate-400">
                No price data available
            </span>
        </div>

    ) : (

        <ResponsiveContainer 
            key={`${holding.holding_id}-${chartRange}-${chartData.length}`}
            width="100%" height="100%"
        >

            <AreaChart
                data={chartData}
                responsive
                margin={{
                    top: 12,
                    right: 8,
                    left: 8,
                    bottom: 0
                }}
                accessibilityLayer={false}
            >

            <defs>

                    <linearGradient
                        id={`chartGradient-${holding.holding_id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >

                        <stop
                            offset="0%"
                            stopColor={chartColor}
                            stopOpacity={0.22}
                        />

                        <stop
                            offset="100%"
                            stopColor={chartColor}
                            stopOpacity={0}
                        />

                    </linearGradient>

                </defs>

                <XAxis
                    dataKey="time"
                    tickFormatter={formatChartTime}
                    tick={{
                        fontSize: 9,
                        fill: "#64748b"
                    }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                    padding={{ left: 10, right: 10 }}
                />

                <YAxis
                    tick={{
                        fontSize: 9,
                        fill: "#64748b"
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                    domain={["auto", "auto"]}
                    tickMargin={8}
                />

                <Tooltip
                    content={<CustomTooltip />}
                    trigger="hover"
                    cursor={false}
                />

                <Area
                    type="monotone"
                    dataKey="price"
                    stroke={chartColor}
                    strokeWidth={2}
                    isAnimationActive={false}
                    fill={`url(#chartGradient-${holding.holding_id})`}
                    dot={false}
                    activeDot={{
                        r: 4,
                        strokeWidth: 2,
                        fill: "#ffffff",
                        stroke: chartColor
                    }}
                />

            </AreaChart>

        </ResponsiveContainer>

    )}

</div>


                    {/* TIME RANGE */}

                    <div className="flex items-center justify-between mt-4">

                        {["1D", "1W", "1M", "6M", "1Y", "5Y"].map(
                            (range) => (

                                <button
                                    key={range}
                                    type="button"
                                    onClick={(event) => {

                                        event.stopPropagation();

                                        setChartRange(range);

                                        loadChartData(
                                            holding.ticker,
                                            range
                                        );

                                    }}
                                    className={`
                                        px-3
                                        py-1.5
                                        rounded-lg
                                        text-xs
                                        font-semibold
                                        transition
                                        ${
                                            range === chartRange
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-500 hover:bg-slate-100"
                                        }
                                    `}
                                >
                                    {range}
                                </button>

                            )
                        )}

                    </div>


                    <p className="text-[10px] text-slate-400 mt-3">
                        Last updated:{" "}
                        {chartLastUpdated
                            ? new Date(chartLastUpdated).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "numeric",
                                minute: "2-digit",
                            })
                            : "—"}
                    </p>

                </div>

            </div>



            {/* ================= BOTTOM STATUS BAR ================= */}

            <div className="flex items-center justify-between gap-3 mt-3">

                {/* MESSAGE — EVERYONE CAN SEE */}

                <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">

                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        i
                    </div>

                    <p className="text-sm font-semibold text-blue-700">
                        {isClosed
                            ? "This trade is closed."
                            : "This trade is currently open."
                        }
                    </p>

                </div>


                {/* ADMIN ONLY */}

                {isAdmin && !isClosed && (

                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();

                            // Close trade logic will be added next.
                        }}
                        className="shrink-0 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition "
                    >
                        Close Trade
                    </button>

                )}

            </div>

        </td>

    </tr>

)}

                                </>
                            );

                        })

                    )}

                </tbody>

            </table>

        </div>
    );
}

export function HistoryTable({ trades = [] }){

    return(
        <div>
            <table className="w-full overflow-y-auto py-2">

            <colgroup>
                <col className="w-[16%]" /> 
                <col className="w-[40%]" /> 
                <col className="w-[8%]" /> 
                <col className="w-[12%]" />  
                <col className="w-[12%]" />  
                <col className="w-[12%]" />  
            </colgroup>
            
            <thead className="sticky top-0 z-30 text-left">
                <tr className="bg-[#e4eeff] font-semibold">
                    <th className="px-4 py-4 rounded-tl-lg ">Buy Date</th>
                    <th>Company</th>
                    <th>Qty</th>
                    <th>Buy Price</th>
                    <th>Net Profit</th>
                    <th className="px-4 py-4 rounded-tr-lg ">Sell Price</th>
                </tr>
            </thead>

            <tbody>
                
                {trades.length === 0 ? (

                        <tr>
                            <td colSpan="9">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="font-semibold text-slate-600">
                                        No trades found for this period
                                    </div>

                                    <div className="text-sm text-slate-400 mt-1">
                                        There are no closed trades for the selected financial year and quarter.
                                    </div>
                                </div>
                            </td>
                        </tr>

                    ) : (

                        trades.map((trade) => {

                            const buyDate = getDateInfo(trade.buy_date);


                            return(

                                <tr 
                                    key={trade.holding_id}
                                    className="bg-white"
                                >
                                    
                                    <td className="pl-4">
                                        {buyDate.date} {buyDate.monthName} {buyDate.year}
                                    </td>
                                    <td className="flex py-4 font-bold items-center gap-2">
                                        <span className = "shrink-0 w-9 h-9 rounded-full bg-[#9ab9ee] flex items-center justify-center overflow-hidden">              {/* Green Circle */}
                                            <img 
                                                src={trade.logo_url}
                                                alt={trade.company_name}
                                                className="w-full h-full object-contain"
                                            />
                                        </span>
                                        <h1>{trade.company_name}</h1>
                                    </td>
                                    <td>{trade.quantity}</td>
                                    <td>₹ {Number(trade.buy_price).toFixed(2)}</td>
                                    <td className= {`font-bold ${
                                        (
                                            Number(trade.quantity) *
                                            (
                                                Number(trade.sell_price) -
                                                Number(trade.buy_price)
                                            )
                                        ) >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                    >
                                        ₹ {
                                            (
                                                Number(trade.quantity) *
                                                (
                                                    Number(trade.sell_price) -
                                                    Number(trade.buy_price)
                                                )
                                            ).toFixed(2)
                                        }
                                    </td>
                                    <td className="p-4">
                                        ₹ {Number(trade.sell_price).toFixed(2)}
                                    </td>
                                </tr>

                                // <tr className="bg-[#e4eeff] font-semibold">
                                //     <td className="p-4 rounded-bl-lg">Total Portfolio Statistics</td>
                                //     <td></td>
                                //     <td></td>
                                //     <td></td>
                                //     <td></td>
                                //     <td></td>
                                //     <td>₹ 11,356.80</td>
                                //     <td>₹ 1028.80</td>
                                //     <td className="p-4 rounded-br-lg">₹ 1,291.00</td>
                                // </tr>

                            );

                        })

                    )}

            </tbody>

        </table>
        </div>
    )
}

export function UserManagementTable({users}){

    const navigate = useNavigate();

    return(
        <div>
            <table className="w-full overflow-y-auto py-2">
                
                <thead className="sticky top-0 z-30 text-left">
                    
                    <tr className="bg-[#e4eeff] font-semibold">
                        <th className="px-4 py-4 rounded-tl-lg ">User Name</th>
                        <th>Trade Status</th>
                        <th>Portfolio Amount</th>
                        <th>Current Invested</th>
                        <th className="rounded-tr-lg" >Profit Share</th>
                    </tr>

                </thead>

                <tbody>
                    
                    {
                        users.map((user) => (

                            <tr key={user.id}
                                onClick={() => navigate("/usermanagement/clientdetails")} 
                                className="bg-white cursor-pointer">
                                
                                <td className="flex px-4 py-4 font-bold items-center gap-2">
                                    
                                    <span className = "flex justify-center items-center bg-green-profile w-8 md:w-10 h-8 md:h-10 rounded-full py-2 px-2">              {/* Green Circle */}
                                        <p className = "text-green-800">
                                            {user.first_name.charAt(0)}                                                                                                                           {/* Client Profile Text */}
                                        </p>
                                    </span>
                                    
                                    <h1>{user.first_name} {user.last_name}</h1>

                                </td>

                                <td>
                                    <span className="rounded-full px-3 py-1 bg-green-300 font-semibold text-[#0c5b43]">
                                        {user.status}
                                    </span>
                                </td>

                                <td>₹ {user.portfolio_amount}</td>

                                <td>Yet to calc</td>

                                <td>Yet to calc</td>

                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
    )
}

export function PendingApprovalsTable(){
    return(
        <div>
            <table className="w-full overflow-y-auto py-2">
            
            <thead className="sticky top-0 z-30 text-left">
                <tr className="bg-[#e4eeff] font-semibold">
                    <th className="px-4 py-4 rounded-tl-lg ">User Name</th>
                    <th>Email Id</th>
                    <th>Phone Number</th>
                    <th>Registration Date</th>
                    <th className="px-4 py-4 rounded-tr-lg ">Actions</th>
                </tr>
            </thead>

            <tbody>
                
                <tr className="bg-white">
                    <td className=" flex px-4 py-4 font-bold  items-center gap-2">
                        <Link to="clientdetails">
                            <span className = "flex justify-center items-center bg-green-profile w-8 md:w-10 h-8 md:h-10 rounded-full py-2 px-2">              {/* Green Circle */}
                                <p className = "text-green-800">
                                    M                                                                                                                           {/* Client Profile Text */}
                                </p>
                            </span>
                        </Link>
                        <h1>Manavi Bhonsale</h1>
                    </td>
                    <td>manavi.Bhonsale@gmail.com</td>
                    <td>+91 7890890871</td>
                    <td>28 May 2025</td>
                    <td className="flex gap-3">
                        < Approve />
                        < Reject />
                    </td>
                </tr>

                <tr className="bg-white">
                    <td className=" flex px-4 py-4 font-bold  items-center gap-2">
                        <Link to="clientdetails">
                            <span className = "flex justify-center items-center bg-green-profile w-8 md:w-10 h-8 md:h-10 rounded-full py-2 px-2">              {/* Green Circle */}
                                <p className = "text-green-800">
                                    P                                                                                                                           {/* Client Profile Text */}
                                </p>
                            </span>
                        </Link>
                        <h1>Payal Sabnis</h1>
                    </td>
                    <td>payal.sabnis2004@gmail.com</td>
                    <td>+91 7866886688</td>
                    <td>11 Jun 2025</td>
                    <td className="flex gap-3">
                        < Approve />
                        < Reject />
                    </td>
                </tr>

                

            </tbody>

        </table>
        </div>
    )
}

export function EquityHoldings(){
    return(
        <div className="bg-white h-52 rounded-2xl p-6 flex flex-col gap-1">
            <h3 className="text-primary font-bold text-sm">Equity Holdings</h3>

            <div className="flex-1 overflow-y-auto pr-2">
                <table className=" w-full bg-white overflow-y-auto my-4 py-2">
                    <thead className="sticky top-0 z-30 m-1">
                        <tr className="bg-[#C6D9F9] text-sm font-semibold ">
                            <th className="  px-4 py-1 rounded-l-lg text-left">Company</th>
                            <th className="  text-left">Sector</th>
                            <th className="  text-left">Qnty</th>
                            <th className="  text-left">Buy Price</th>
                            <th className="  text-left">Current Price</th>
                            <th className="  text-left">Invested Amount</th>
                            <th className="  px-4 py-1 rounded-r-lg text-left">Net Position</th>
                        </tr>
                    </thead>

                    <tbody className="">
                        <tr className="text-sm border-b border-slate-300">
                            <td className="px-4 py-1">JSW Steel LTD</td>
                            <td>Energy</td>
                            <td>12</td>
                            <td>₹ 1125.70</td>
                            <td>₹ 1281.00</td>
                            <td>₹ 13508.40</td>
                            <td>₹ 1863.60</td>
                        </tr>

                        <tr className="text-sm border-b border-slate-300">
                            <td className="px-4 py-1">JSW Steel LTD</td>
                            <td>Energy</td>
                            <td>12</td>
                            <td>₹ 1125.70</td>
                            <td>₹ 1281.00</td>
                            <td>₹ 13508.40</td>
                            <td>₹ 1863.60</td>
                        </tr>

                        <tr className="text-sm border-b  border-slate-300">
                            <td className="px-4 py-1">JSW Steel LTD</td>
                            <td>Energy</td>
                            <td>12</td>
                            <td>₹ 1125.70</td>
                            <td>₹ 1281.00</td>
                            <td>₹ 13508.40</td>
                            <td>₹ 1863.60</td>
                        </tr>

                        <tr className="text-sm border-b  border-slate-300">
                            <td className="px-4 py-1">JSW Steel LTD</td>
                            <td>Energy</td>
                            <td>12</td>
                            <td>₹ 1125.70</td>
                            <td>₹ 1281.00</td>
                            <td>₹ 13508.40</td>
                            <td>₹ 1863.60</td>
                        </tr>

                        <tr className="text-sm border-b border-slate-300">
                            <td className="px-4 py-1">JSW Steel LTD</td>
                            <td>Energy</td>
                            <td>12</td>
                            <td>₹ 1125.70</td>
                            <td>₹ 1281.00</td>
                            <td>₹ 13508.40</td>
                            <td>₹ 1863.60</td>
                        </tr>

                        <tr className="text-sm border-b  border-slate-300">
                            <td className="px-4 py-1">JSW Steel LTD</td>
                            <td>Energy</td>
                            <td>12</td>
                            <td>₹ 1125.70</td>
                            <td>₹ 1281.00</td>
                            <td>₹ 13508.40</td>
                            <td>₹ 1863.60</td>
                        </tr>

                        <tr className="text-sm border-b  border-slate-300">
                            <td className="px-4 py-1">JSW Steel LTD</td>
                            <td>Energy</td>
                            <td>12</td>
                            <td>₹ 1125.70</td>
                            <td>₹ 1281.00</td>
                            <td>₹ 13508.40</td>
                            <td>₹ 1863.60</td>
                        </tr>

                        <tr className="text-sm border-b border-slate-300">
                            <td className="px-4 py-1">JSW Steel LTD</td>
                            <td>Energy</td>
                            <td>12</td>
                            <td>₹ 1125.70</td>
                            <td>₹ 1281.00</td>
                            <td>₹ 13508.40</td>
                            <td>₹ 1863.60</td>
                        </tr>

                        <tr className="text-sm border-b  border-slate-300">
                            <td className="px-4 py-1">JSW Steel LTD</td>
                            <td>Energy</td>
                            <td>12</td>
                            <td>₹ 1125.70</td>
                            <td>₹ 1281.00</td>
                            <td>₹ 13508.40</td>
                            <td>₹ 1863.60</td>
                        </tr>
                    </tbody>
                    
                </table>
            </div>

        </div>
    )
}