import { ethers } from "ethers";
import { CONFIG } from "./config";
import { logger } from "./logger";

const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);

const wallet = new ethers.Wallet(
    CONFIG.PRIVATE_KEY,
    provider
);

export function getWallet() {
    return wallet;
}

export function getWalletAddress(): string {
    return wallet.address;
}

export async function getBNBBalance(): Promise<number> {

    try {

        const balance = await provider.getBalance(wallet.address);

        return Number(
            ethers.formatEther(balance)
        );

    } catch (err) {

        logger.error(
            `Unable to fetch BNB balance: ${err}`
        );

        return 0;
    }
}

const ERC20_ABI = [

    "function balanceOf(address owner) view returns (uint256)",

    "function decimals() view returns (uint8)"

];

export async function getTokenBalance(
    tokenAddress: string
): Promise<number> {

    try {

        const token = new ethers.Contract(
            tokenAddress,
            ERC20_ABI,
            provider
        );

        const balance =
            await token.balanceOf(wallet.address);

        const decimals =
            await token.decimals();

        return Number(
            ethers.formatUnits(
                balance,
                decimals
            )
        );

    } catch (err) {

        logger.error(
            `Unable to fetch token balance: ${err}`
        );

        return 0;
    }
}

export async function showWalletStatus() {

    const bnb = await getBNBBalance();

    const token =
        await getTokenBalance(CONFIG.TOKEN);

    logger.info(`Wallet: ${wallet.address}`);

    logger.info(`BNB Balance: ${bnb}`);

    logger.info(`Token Balance: ${token}`);
                                                  }
