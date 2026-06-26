import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {

    PRIVATE_KEY: process.env.PRIVATE_KEY || "",

    RPC_URL: process.env.BSC_RPC_URL || "",

    OPENAI_KEY: process.env.OPENAI_API_KEY || "",

    TOKEN: process.env.TOKEN_TO_TRADE || "",

    TRADE_AMOUNT: process.env.TRADE_AMOUNT_BNB || "0.01",

    MAX_SLIPPAGE: Number(process.env.MAX_SLIPPAGE_PERCENT || 1),

    INTERVAL: Number(process.env.CHECK_INTERVAL_MINUTES || 5),

    CHAIN_ID: 56,

    DEADLINE_MINUTES: 20,

    ROUTER:

        "0x10ED43C718714eb63d5aA57B78B54704E256024E",

    WBNB:

        "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"

};
