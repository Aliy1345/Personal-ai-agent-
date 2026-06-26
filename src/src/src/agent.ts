import cron from "node-cron";
import OpenAI from "openai";

import { CONFIG } from "./config";
import { logger } from "./logger";

import {
    getMarketData,
    analyzeTrend,
    updatePriceHistory
} from "./market";

import {
    getBNBBalance,
    getTokenBalance,
    getWalletAddress
} from "./wallet";

import {
    swapBNBForToken,
    swapTokenForBNB
} from "./trader";

const openai = new OpenAI({
    apiKey: CONFIG.OPENAI_KEY
});

let priceHistory: number[] = [];

let cooldown = 0;

let lastTrade: "BUY" | "SELL" | "HOLD" = "HOLD";

interface AIDecision {

    action: "BUY" | "SELL" | "HOLD";

    reasoning: string;

    confidence: number;

    amountPercent: number;

}

async function askAI(payload: object): Promise<AIDecision> {

    try {

        const response =
            await openai.chat.completions.create({

                model: "gpt-4o",

                temperature: 0.2,

                messages: [

                    {
                        role: "system",

                        content:
                            "You are a conservative crypto AI. Respond ONLY with valid JSON having action, reasoning, confidence and amountPercent."
                    },

                    {
                        role: "user",

                        content: JSON.stringify(payload)
                    }

                ]

            });

        const text =
            response.choices[0].message.content ?? "";

        return JSON.parse(text);

    } catch (err) {

        logger.error(
            `AI parse failed: ${err}`
        );

        return {

            action: "HOLD",

            reasoning: "Fallback",

            confidence: 0,

            amountPercent: 0

        };

    }

}

async function runAgent() {

    logger.info("----------------------");

    logger.info("Starting cycle");

    if (cooldown > 0) {

        cooldown--;

        logger.warn(
            `Cooldown active (${cooldown} cycles remaining)`
        );

        return;

    }

    const market =
        await getMarketData(CONFIG.TOKEN);

    priceHistory =
        updatePriceHistory(
            priceHistory,
            market.price
        );

    const trend =
        analyzeTrend(priceHistory);

    const bnb =
        await getBNBBalance();

    const token =
        await getTokenBalance(CONFIG.TOKEN);

    if (bnb < 0.005) {

        logger.warn(
            "Insufficient BNB. Keeping gas reserve."
        );

        return;

    }

    const ai =
        await askAI({

            wallet: getWalletAddress(),

            currentPrice: market.price,

            priceChange24h:
                market.priceChange24h,

            volume24h:
                market.volume24h,

            trendSignal: trend,

            bnbBalance: bnb,

            tokenBalance: token,

            history: priceHistory

        });

    logger.info(
        `AI Action: ${ai.action}`
    );

    logger.info(
        `Confidence: ${ai.confidence}`
    );

    logger.info(
        `Reason: ${ai.reasoning}`
    );

    if (ai.confidence <= 0.65) {

        logger.warn(
            "Confidence too low."
        );

        return;

    }

    if (
        ai.action === lastTrade &&
        ai.action !== "HOLD"
    ) {

        logger.warn(
            "Blocked duplicate trade direction."
        );

        return;

    }

    const percent =
        Math.min(
            ai.amountPercent,
            50
        );

    try {

        if (ai.action === "BUY") {

            const amount =
                (
                    bnb *
                    (percent / 100)
                ).toFixed(6);

            await swapBNBForToken(
                CONFIG.TOKEN,
                amount
            );

            lastTrade = "BUY";

        }

        else if (ai.action === "SELL") {

            const amount =
                (
                    token *
                    (percent / 100)
                ).toFixed(6);

            await swapTokenForBNB(
                CONFIG.TOKEN,
                amount
            );

            lastTrade = "SELL";

        }

        else {

            lastTrade = "HOLD";

            logger.warn(
                "AI decided to HOLD."
            );

        }

    }

    catch (err) {

        cooldown = 2;

        logger.error(
            `Trade failed: ${err}`
        );

    }

}

logger.info("================================");

logger.info("BNB AI AGENT STARTED");

logger.info(`Wallet: ${getWalletAddress()}`);

logger.info(
    `Running every ${CONFIG.INTERVAL} minutes`
);

logger.info("================================");

runAgent();

cron.schedule(
    `*/${CONFIG.INTERVAL} * * * *`,
    runAgent
);
