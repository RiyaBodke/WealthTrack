import axios from "axios";

const RANGE_CONFIG = {
    "1D": { range: "1d", interval: "5m" },
    "1W": { range: "5d", interval: "30m" },
    "1M": { range: "1mo", interval: "1d" },
    "6M": { range: "6mo", interval: "1d" },
    "1Y": { range: "1y", interval: "1d" },
    "5Y": { range: "5y", interval: "1wk" },
};

export async function getHistoricalPrices(ticker, selectedRange = "1M") {

    const config = RANGE_CONFIG[selectedRange];

    if (!config) {
        throw new Error("Invalid range");
    }

    const symbol = ticker.endsWith(".NS")
        ? ticker
        : `${ticker}.NS`;

    const url =
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

    const response = await axios.get(url, {
        params: {
            range: config.range,
            interval: config.interval,
        },
    });

    const result = response.data?.chart?.result?.[0];

    if (!result) {
        throw new Error(`No market data found for ${ticker}`);
    }

    const timestamps = result.timestamp || [];
    const prices = result.indicators?.quote?.[0]?.close || [];

    const data = timestamps
        .map((timestamp, index) => ({
            time: new Date(timestamp * 1000).toISOString(),
            price: prices[index],
        }))
        .filter((point) => point.price !== null && point.price !== undefined);

    return {
        ticker,
        range: selectedRange,
        data,
        lastUpdated: new Date().toISOString(),
    };
}