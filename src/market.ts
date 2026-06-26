import axios from "axios";
import { logger } from "./logger";

export interface MarketData {
    price: number;
    priceChange24h: number;
    volume24h: number;
}

export async function getTokenPrice(
    tokenAddress: string
): Promise<number> {

    try {

        const url =
            `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${tokenAddress}&vs_currencies=usd`;

        const response = await axios.get(url);

        const data =
            response.data[tokenAddress.toLowerCase()];

        if (!data) {
            return 0;
        }

        return Number(data.usd);

    } catch (err) {

        logger.error(
            `Price fetch failed: ${err}`
        );

        return 0;
    }

}

export async function getMarketData(
    tokenAddress: string
): Promise<MarketData> {

    try {

        const url =
            `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${tokenAddress}`;

        const response = await axios.get(url);

        return {

            price:
                response.data.market_data.current_price.usd,

            priceChange24h:
                response.data.market_data.price_change_percentage_24h,

            volume24h:
                response.data.market_data.total_volume.usd

        };

    } catch (err) {

        logger.error(
            `Market fetch failed: ${err}`
        );

        return {

            price: 0,

            priceChange24h: 0,

            volume24h: 0

        };

    }

}

function average(numbers: number[]): number {

    if (numbers.length === 0)
        return 0;

    const sum =
        numbers.reduce(
            (a, b) => a + b,
            0
        );

    return sum / numbers.length;

}

export function analyzeTrend(
    history: number[]
): "BUY" | "SELL" | "HOLD" {

    if (history.length < 7)
        return "HOLD";

    const sma3 =
        average(history.slice(-3));

    const sma7 =
        average(history.slice(-7));

    if (sma3 > sma7)
        return "BUY";

    if (sma3 < sma7)
        return "SELL";

    return "HOLD";
}

export function updatePriceHistory(
    history: number[],
    latestPrice: number
): number[] {

    history.push(latestPrice);

    if (history.length > 10)
        history.shift();

    return history;

  }
