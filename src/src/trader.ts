import { ethers } from "ethers";
import { CONFIG } from "./config";
import { getWallet } from "./wallet";
import { logger } from "./logger";

const wallet = getWallet();

const ROUTER_ABI = [

"function getAmountsOut(uint amountIn,address[] calldata path) external view returns(uint[] memory amounts)",

"function swapExactETHForTokens(uint amountOutMin,address[] calldata path,address to,uint deadline) payable returns(uint[] memory amounts)",

"function swapExactTokensForETH(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) returns(uint[] memory amounts)"

];

const ERC20_ABI = [

"function approve(address spender,uint amount) returns(bool)",

"function balanceOf(address owner) view returns(uint)",

"function decimals() view returns(uint8)"

];

const router = new ethers.Contract(
    CONFIG.ROUTER,
    ROUTER_ABI,
    wallet
);

/**
 * Estimate output amount.
 */
export async function getAmountOut(
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint
): Promise<bigint> {

    try {

        const path =
            tokenIn === CONFIG.WBNB
                ? [tokenIn, tokenOut]
                : [tokenIn, CONFIG.WBNB, tokenOut];

        const amounts =
            await router.getAmountsOut(
                amountIn,
                path
            );

        return amounts[amounts.length - 1];

    } catch (err) {

        logger.error(
            `Quote failed: ${err}`
        );

        return 0n;

    }

}

/**
 * Mock BUY.
 */
export async function swapBNBForToken(
    token: string,
    amount: string
): Promise<string> {

    logger.info("==========");

    logger.info("MOCK BUY");

    logger.info(`Token : ${token}`);

    logger.info(`Amount : ${amount} BNB`);

    logger.info(
        "Simulation only. No transaction sent."
    );

    logger.info("==========");

    return "MOCK_BUY_TX_HASH";

}

/**
 * Mock SELL.
 */
export async function swapTokenForBNB(
    token: string,
    amount: string
): Promise<string> {

    logger.info("==========");

    logger.info("MOCK SELL");

    logger.info(`Token : ${token}`);

    logger.info(`Amount : ${amount}`);

    logger.info(
        "Simulation only. No transaction sent."
    );

    logger.info("==========");

    return "MOCK_SELL_TX_HASH";

}

/**
 * Display token info.
 */
export async function inspectToken(
    token: string
) {

    try {

        const contract =
            new ethers.Contract(
                token,
                ERC20_ABI,
                wallet
            );

        const decimals =
            await contract.decimals();

        const balance =
            await contract.balanceOf(
                wallet.address
            );

        logger.info(
            `Token decimals: ${decimals}`
        );

        logger.info(
            `Raw balance: ${balance}`
        );

    } catch (err) {

        logger.error(
            `Inspection failed: ${err}`
        );

    }

  }
