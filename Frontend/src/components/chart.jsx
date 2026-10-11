'use client';

import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";                                

const data = [                                              
    { date: "Apr 1", value: 40994 },
    { date: "Apr 2", value: 41320 },
    { date: "Apr 3", value: 41080 },
    { date: "Apr 4", value: 41650 },
    { date: "Apr 5", value: 42010 },
    { date: "Apr 6", value: 41700 },
    { date: "Apr 7", value: 42380 },
    { date: "Apr 8", value: 42850 },
    { date: "Apr 9", value: 42420 },
    { date: "Apr 10", value: 43100 },
    { date: "Apr 11", value: 43620 },
    { date: "Apr 12", value: 43310 },
    { date: "Apr 13", value: 43980 },
    { date: "Apr 14", value: 44550 },
    { date: "Apr 15", value: 44120 },
    { date: "Apr 16", value: 44890 },
    { date: "Apr 17", value: 45500 },
    { date: "Apr 18", value: 44980 },
    { date: "Apr 19", value: 45720 },
    { date: "Apr 20", value: 46350 },
    { date: "Apr 21", value: 45910 },
    { date: "Apr 22", value: 46800 },
    { date: "Apr 23", value: 47420 },
    { date: "Apr 24", value: 46950 },
    { date: "Apr 25", value: 47880 },
    { date: "Apr 26", value: 48500 },
    { date: "Apr 27", value: 48020 },
    { date: "Apr 28", value: 48950 },
    { date: "Apr 29", value: 49600 },
    { date: "Apr 30", value: 50350 },
];                                                                          {/* Temp Graph Data */}

const isProfit =data[data.length-1].value > data[0].value;                  {/* Chart Color Change Logic According to */}
const graphColor = isProfit ? "#13AD9F" : "#E5484D";

const AreaChartComponent = () => {
    return(
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>

                <defs>
                    <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={graphColor} stopOpacity={0.7}/>
                        <stop offset="95%" stopColor={graphColor} stopOpacity={0}/>
                    </linearGradient>
                </defs>

                <Area   
                    dataKey="value"
                    type="natural"
                    stroke={graphColor}
                    strokeWidth={4}
                    fill="url(#graphGradient)"
                />

            </AreaChart>
        </ResponsiveContainer>
    );
};

export function LineChart(){
    return(
        <div className="bg-white h-96 rounded-2xl px-6 py-4 flex flex-col">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-bold">Profits Chart</h3>
                
                <span className="">
                    <h5 className="text-xs font-bold">Quarter 4 / 2025-26</h5>
                    <h6 className="text-xxxs font-medium text-gray">Monday, 18 March 2026  9:41 am</h6>
                </span>

            </div>

            <div className="flex gap-1 my-5">
                <div className="bg-chart h-72 rounded-lg flex-1">
                    <AreaChartComponent />
                </div>
            </div>

        </div>
    )
}

export function PieChart(){
    return(
        <div className=" bg-white h-auto rounded-2xl p-6 text-sm">
            <h3 className="text-base text-primary font-bold">Sector Allocation</h3>
            <h3 className="text-[#8D959D] text-xs font-bold">Balanced across 4 sectors</h3>

            <div className="rounded-full bg-[#DFE7F6] h-[164px] w-[164px] my-2"></div>
            <div className="flex text-xs">
                <div className="text-[#8D959D] font-semibold">Total Portfolio : </div>
                <div className="text-primary font-bold"> ₹2,24,500</div>
            </div>
        </div>
    )
}