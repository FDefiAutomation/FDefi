<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-6 col-md-auto">
        <q-card
          style="height: 120px; max-width: 400px"
          flat
          class="my-card q-ma-xs bg-darkblue text-white"
        >
          <q-card-section>
            <q-toggle
              size="xl"
              v-model="startStopToggle"
              checked-icon="check"
              color="green"
              class="text-weight-bold; text-h6"
              :label="`${isBotRunning}`"
              unchecked-icon="pause"
            />

            <span v-if="!netWorth && startStopToggle">
              <br />
              <q-circular-progress
                indeterminate
                rounded
                size="xs"
                color="white"
                class="q-ma-md on-right"
              />initializing...
            </span>
            <span v-else>
              <br />
              <span class="text-h5 on-right text-grey" v-if="formattedTime">{{
                formattedTime
              }}</span>
            </span>
          </q-card-section>
        </q-card>
      </div>

      <div class="col col-md-auto" v-if="startingNetWorth">
        <q-card
          style="height: 120px"
          flat
          class="my-card q-ma-xs bg-blue-grey-1 text-black"
        >
          <q-card-section>
            <p v-if="startingNetWorth"></p>

            <span class="text-weight-bold"
              ><q-tooltip>Balace in USD: ETH + WETH + USDC + USDT</q-tooltip>
              Starting: ${{ Number(startingNetWorth).toFixed(2) }}</span
            ><br />
            <span
              :class="{
                'text-weight-bold text-grey-6':
                  Number(netWorth) === Number(startingNetWorth),
                'text-weight-bold text-red-6':
                  Number(netWorth) < Number(startingNetWorth),
                'text-weight-bold text-green-6':
                  Number(netWorth) > Number(startingNetWorth),
              }"
              >Current: &nbsp;${{ Number(netWorth).toFixed(2) }}</span
            >
            <br /><span class="text-weight-bold text-grey">
              <q-tooltip> win / loss </q-tooltip>
              <span class="text-green">{{ winCount }}</span> :
              <span class="text-red">{{ lossCount }}</span></span
            >
          </q-card-section>
        </q-card>
      </div>

      <div class="col" v-if="Number(balance) > 0">
        <q-card
          style="height: 120px"
          flat
          class="my-card q-ma-xs bg-blue-grey-1 text-black"
        >
          <v-layout>
            <q-card-section>
              <p>
                <span class="text-h">{{ Number(balance).toFixed(6) }} ETH</span>
                <br />

                <span class="text-h">
                  {{ Number(balanceWETH).toFixed(7) }} WETH </span
                ><br />
                <span class="text-h"
                  >{{ Number(balanceUSDC).toFixed(7) }} USDC</span
                >
                <br />
                <span class="text-h">
                  {{ Number(balanceUSDT).toFixed(7) }} USDT
                </span>

                <br />
              </p>
            </q-card-section>
          </v-layout>
        </q-card>
      </div>

      <div class="col" v-if="netWorth">
        <q-card
          style="height: 120px"
          flat
          class="my-card q-ma-xs bg-blue-grey-1 black-white"
        >
          <v-layout>
            <q-card-section>
              <p>
                <a target="_blank" href="https://app.uniswap.org/swap"
                  >uniswap</a
                >
                |
                <a target="_blank" href="https://www.dextools.io/app/en"
                  >dextools</a
                >
                |
                <a target="_blank" href="https://dexscreener.com/gainers"
                  >dexscreener</a
                >
                |

                <a target="_blank" href="https://l2fees.info/">l2 fees</a>
              </p>
              <p v-if="balance && signerAddress">
                Wallet
                <a
                  target="_blank"
                  :href="`${explorerURL}/address/${signerAddress}`"
                  >{{ ellipsizeIt(signerAddress, 8) }}
                </a>
              </p>
            </q-card-section>
          </v-layout>
        </q-card>
      </div>

      <div class="col">
        <q-card
          style="height: 120px"
          flat
          v-if="boughtToken && boughtToken.balance"
          class="my-card q-ma-xs bg-black text-white"
        >
          <v-layout>
            <q-card-section>
              <p>
                <span class="text-h"
                  ><i class="q-pa-xs material-icons text-white">shopping_bag</i
                  >Holding: {{ Number(boughtToken.balance).toFixed(6) }}
                  {{ boughtToken.symbol }}</span
                >
              </p>

              <p>
                <span v-if="boughtWithToken"
                  >{{ Number(currentTokenPrice).toFixed(6) }}
                  {{ boughtToken.symbol }}
                  <i class="q-pa-xs material-icons text-white">multiple_stop</i>
                  1 {{ boughtWithToken.symbol }}
                </span>
                <br />
                <q-circular-progress
                  indeterminate
                  rounded
                  size="xs"
                  color="white"
                  class="q-ma-md"
                />
                <span
                  :class="{
                    'text-grey-6': Number(percentageChange) === 0,
                    'text-red-6': Number(percentageChange) < 0,
                    'text-green-6': Number(percentageChange) > 0,
                  }"
                  v-if="currentTokenPrice"
                  >{{ Number(percentageChange).toFixed(6) }}%</span
                >

                <q-btn
                  @click="closePosition"
                  class="q-ma-xs"
                  text-color="white"
                  round
                  icon="exit_to_app"
                  size="sm"
                  ><q-tooltip>close position</q-tooltip>
                </q-btn>
              </p>
            </q-card-section>
          </v-layout>
        </q-card>
      </div>
    </div>

    <div class="q-pa-xs">
      <q-infinite-scroll
        v-model="vLogs"
        :disable="isVLogDisabled"
        @load="loadLogs"
      >
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <div
          v-for="(item, index) in logItems"
          :key="index"
          class="caption q-mt-xs"
        >
          <p v-if="item">
            <span class="text-grey-7 q-mr-md">{{ item.timestamp }}</span>
            <span v-if="item.data.startsWith('system:')"
              ><i class="q-pa-xs material-icons text-red">warning</i></span
            >
            <span v-if="item.data.startsWith('buy:')"
              ><i class="q-pa-xs material-icons">call_made</i></span
            >

            <span v-if="item.data.startsWith('watch:')"
              ><i class="q-pa-xs material-icons">remove_red_eye</i></span
            >
            <span v-if="item.data.startsWith('sell:')"
              ><i class="q-pa-xs material-icons">call_received</i></span
            >
            <span v-if="item.data.startsWith('price_check:')"
              ><i class="q-pa-xs material-icons">access_time</i></span
            >
            <span v-html="item.data"></span>
            <span
              class="q-ml-sm q-mr-sm"
              v-if="item.txHash"
              style="font-size: 0.8em; color: grey"
            >
              <a :href="`${explorerURL}/tx/${item.txHash}`" target="_blank"
                >view transaction</a
              >
            </span>
          </p>
        </div>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import { LocalStorage } from "quasar";
import { ethers } from "ethers";
import * as CryptoJS from "crypto-js";
import JSBI from "jsbi";
import dingSound from "../assets/ding.mp3";
import { ellipsizeIt } from "../utils/common";
import { decryptAES, encryptAES, sha256 } from "../utils/encryption";
import { uniswapV3PoolABI } from "../../data/uniswapV3PoolABI";
import { swapRouter02ABI } from "../../data/swapRouter02ABI";
import { priceFeedABI } from "../../data/priceFeedABI";
import { getWeb3ProviderInstance } from "../../ethereum/web3provider";
import { getEthersProviderInstance } from "../../ethereum/ethersprovider";
import { erc20ABI } from "../../data/erc20";
import quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import {
  Token,
  SWAP_ROUTER_02_ADDRESSES,
  V3_CORE_FACTORY_ADDRESSES,
} from "@uniswap/sdk-core";
import {
  Trade as V3TradeSDK,
  Route as RouteV3,
  computePoolAddress,
} from "@uniswap/v3-sdk";
import { Web3BaseProvider } from "web3";
//import * as later from "@breejs/later";

interface LogItem {
  timestamp: string;
  data: string;
  txHash: string;
}

export default {
  setup() {
    // State

    let logItems = ref<LogItem[]>([]);

    const items = ref([]);
    const isBotRunning = ref("Paused");
    const startStopToggle = ref(false);
    const netWorth = ref<number | null>(null);
    const formattedTime = ref<string | null>(null);
    const startingNetWorth = ref<number | null>(null);
    const winCount = ref(0);
    const lossCount = ref(0);
    let balance = ref<string | null>(null);
    const balanceWETH = ref<string | null>(null);
    const balanceUSDC = ref<string | null>(null);
    const balanceUSDT = ref<string | null>(null);
    const explorerURL = ref<string | null>(null);
    const boughtToken = ref<{
      address: string;
      balance: string;
      decimals: string;
      symbol: string;
    } | null>(null);
    const boughtWithToken = ref<{ symbol: string } | null>(null);
    const currentTokenPrice = ref<number | null>(null);
    const percentageChange = ref<number | null>(null);
    const vLogs = ref<string | null>(null);
    const isVLogDisabled = ref(true);
    let signer: ethers.Wallet;
    // Other reactive or plain values
    let web3Provider: any;
    let ethersProvider: ethers.WebSocketProvider;
    let startTimeStamp: number = 0;
    let runningFor: number;

    let chainId: Number;

    const isExecutingBuy = ref(false);
    const isToken0TradedToken = ref(false);

    let swapRouter02ABI; // No need for ref if it's a constant

    let ethUsdPriceFeedAddress: string;
    let erc20Contract: ethers.Contract;
    let wethContract: ethers.Contract;
    let tokenBoughtContract: ethers.Contract;
    let usdcContract: ethers.Contract;
    let usdtContract: ethers.Contract;
    let poolContract: ethers.Contract;
    let priceFeedContract: ethers.Contract;
    const initialTokenPrice = ref<number | null>(null);
    let logDone;
    let rpcURL: string = "null";
    const initialBalance = ref<string | null>(null);
    const signerAddress = ref<string | null>(null);
    const initialBalanceWETH = ref<string | null>(null);
    const initialBalanceUSDC = ref<string | null>(null);
    const initialBalanceUSDT = ref<string | null>(null);
    const running_for = ref(0);
    const runningForInterval = ref<NodeJS.Timeout | null>(null);

    const TRADED_TOKEN = ref<Token | null>(null);
    const EInterfaceV3 = ref<ethers.Interface | null>(null);
    let useWETH: boolean;
    let useUSDC: boolean;
    let useUSDT: boolean;
    const lastUSDPrice = ref(0);
    const ethUsdPrice = ref(0);
    let wethAddress: string;
    let tradedToken: string;
    let usdcAddress: string;
    let usdtAddress: string;
    let simulationMode = ref(true);
    const bigSellPauseUntil = ref(0);
    let takeProfitAtPercent: number;
    let stopLossAtPercent: number;
    let watchedTokens: string;
    let valueETHToBuy: number;
    let valueUSDToBuy: number;
    let minLiqudityETHAdded: number;
    let minUSDSold: number;
    let minETHSold: number;
    let watchedPool: string;
    const poolFee = ref<number | null>(null);
    const watchTimeout = ref<NodeJS.Timeout | null>(null);
    let checkboxPauseOnPriceDrops: boolean;
    let checkboxTradeOnlyETHHasGains: boolean;
    let checkboxPlaySoundOnBuy: boolean;
    const swapRouterV2Interface = ref<ethers.Interface | null>(null);
    const uniswapPoolv3Interface = ref<ethers.Interface | null>(null);
    const token0 = ref<string | null>(null);
    const token0Symbol = ref<string | null>(null);
    const token0Decimals = ref<number | null>(null);
    const token1 = ref<string | null>(null);
    const token1Symbol = ref<string | null>(null);
    const token1Decimals = ref<number | null>(null);
    const web3Subscription = ref<ethers.JsonRpcProvider | null>(null);
    const pauseSellAmount = ref<number | null>(null);
    const pauseSeconds = ref<number | null>(null);

    const plan = ref("BASIC");
    const swapTopic = ref(
      "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
    );
    const transferTopic = ref(
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    );

    const addLog = (message: string, txHash: string | null = null) => {
      // Add logging logic
      if (!txHash) {
        txHash = "";
      }
      logItems.value.push({
        data: message,
        txHash: txHash,
        timestamp: new Date().toLocaleTimeString(),
      });
      if (logItems.value.length > 2000) {
        logItems.value.splice(0, logItems.value.length - 2000);
      }
    };

    const getTokenInfo = async (tokenAddress: string) => {
      const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
      const symbol = await tokenContract.symbol();
      await sleep(200);
      const decimals = await tokenContract.decimals();
      await sleep(100);
      return { symbol, decimals };
    };

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const initialValidation = () => {
      rpcURL = LocalStorage.getItem("rpcURL") || "";
      if (!rpcURL || rpcURL.trim() === "null") {
        addLog(
          "system: the RPC URL is not set. Please go to settings and set it up"
        );
        startStopToggle.value = false;
        return false;
      }
      const storedprivateKey = LocalStorage.getItem("privateKey");
      if (
        storedprivateKey === null ||
        storedprivateKey === "" ||
        storedprivateKey === "null"
      ) {
        addLog(
          "system: there's no private key set. Please go to settings and set it up"
        );
        startStopToggle.value = false;
        return false;
      }

      const storedvalueETHToBuy = LocalStorage.getItem("valueETHToBuy");
      if (storedvalueETHToBuy === null) {
        addLog("system: value in ETH for buying token is not set");
        startStopToggle.value = false;
        return false;
      }

      if (watchedPool === null || String(watchedPool).length < 5) {
        addLog("system: you need to configure a pool to watch");
        startStopToggle.value = false;
        return false;
      }
      if (tradedToken === null || String(tradedToken).length < 5) {
        addLog("system: tradedToken is not set");
        startStopToggle.value = false;
        return false;
      }
      return true;
    };

    const initThings = async (): Promise<boolean> => {
      ethersProvider = getEthersProviderInstance(rpcURL);
      web3Provider = getWeb3ProviderInstance(rpcURL);

      const blockNumber = Number(await ethersProvider.getBlockNumber());
      if (blockNumber < 1) {
        addLog(
          "system: there was an error initializing the RPC connection. Please use a different RPC provider",
          null
        );
        startStopToggle.value = false;
        return false;
      }

      if (simulationMode) {
        addLog("system: SIMULATION MODE ACTIVE. NO TRANSACTIONS WILL BE MADE!");
      }

      addLog(
        "Blockchain connection OK. Block number: " + String(blockNumber),
        null
      );

      const storedprivateKey = LocalStorage.getItem("privateKey");
      const privateKey = decryptAES(String(storedprivateKey));

      try {
        signer = new ethers.Wallet(privateKey, ethersProvider);
      } catch (e) {
        addLog("system: failed to decode private key", null);
        startStopToggle.value = false;
        return false;
      }
      signerAddress.value = await signer.getAddress();

      wethContract = new ethers.Contract(wethAddress, erc20ABI, signer);
      usdcContract = new ethers.Contract(usdcAddress, erc20ABI, signer);
      usdtContract = new ethers.Contract(usdtAddress, erc20ABI, signer);

      priceFeedContract = new ethers.Contract(
        ethUsdPriceFeedAddress,
        priceFeedABI,
        signer
      );
      console.log("checking for pool", watchedPool);

      poolContract = new ethers.Contract(watchedPool, uniswapV3PoolABI, signer);

      //token0.value
      token0.value = String(await poolContract.token0()).toLocaleLowerCase();
      await sleep(200);
      token1.value = String(await poolContract.token1()).toLocaleLowerCase();
      await sleep(200);
      poolFee.value = Number(await poolContract.fee());

      console.log(
        "token0",
        token0.value,
        "token1",
        token1.value,
        "fee",
        poolFee.value
      );

      await sleep(500);

      const { symbol, decimals } = await getTokenInfo(tradedToken);
      TRADED_TOKEN.value = new Token(
        Number(chainId),
        tradedToken,
        Number(decimals),
        symbol,
        symbol
      );

      addLog(
        "watch: traded token: " +
          " <a target='_blank' href='" +
          explorerURL +
          "/token/" +
          tradedToken +
          "'>" +
          TRADED_TOKEN.value.symbol +
          "</a>" +
          ""
      );

      if (token0.value === wethAddress) {
        token0Symbol.value = "WETH";
        token0Decimals.value = 18;
        const { symbol, decimals } = await getTokenInfo(token1.value);
        token1Symbol.value = symbol;
        token1Decimals.value = Number(decimals);
      } else if (token0.value === usdcAddress || token0.value === usdtAddress) {
        token0Symbol.value = token0.value === usdcAddress ? "USDC" : "USDT";
        token0Decimals.value = 6;
        const { symbol, decimals } = await getTokenInfo(token1.value);
        token1Symbol.value = symbol;
        token1Decimals.value = Number(decimals);
      }

      if (token1.value === wethAddress) {
        token1Symbol.value = "WETH";
        token1Decimals.value = 18;
        const { symbol, decimals } = await getTokenInfo(token0.value);
        token0Symbol.value = symbol;
        token0Decimals.value = Number(decimals);
      } else if (token1.value === usdcAddress || token1.value === usdtAddress) {
        token1Symbol.value = token1.value === usdcAddress ? "USDC" : "USDT";
        token1Decimals.value = 6;
        const { symbol, decimals } = await getTokenInfo(token0.value);
        token0Symbol.value = symbol;
        token0Decimals.value = Number(decimals);
      }

      if (token0.value === tradedToken) {
        isToken0TradedToken.value = true;
      }

      addLog(
        "watch: pool: " +
          " <a target='_blank' href='" +
          explorerURL +
          "/address/" +
          watchedPool +
          "#readContract'>" +
          ellipsizeIt(watchedPool, 8) +
          "</a>, fee: " +
          String(poolFee.value) +
          ", token0: " +
          " <a target='_blank' href='" +
          explorerURL +
          "/token/" +
          token0.value +
          "'>" +
          token0Symbol.value +
          "</a>, token1: " +
          " <a target='_blank' href='" +
          explorerURL +
          "/token/" +
          token1.value +
          "'>" +
          token1Symbol.value +
          "</a>" +
          ""
      );

      const priceToken1InToken0 = await getPriceToken1InToken0();
      console.log("priceToken1InToken0", priceToken1InToken0);

      return true;
    };

    const getPriceToken1InToken0 = async () => {
      await sleep(200);
      const slot0 = await poolContract.slot0();
      const sqrtPriceX96 = Number(slot0.sqrtPriceX96.toString());
      const priceToken1InToken0 = sqrtPriceX96 ** 2 / 2 ** 192;
      const adjustedPriceToken1InToken0 =
        priceToken1InToken0 /
        10 ** (token1Decimals.value! - token0Decimals.value!);
      const adjustedPriceToken0InToken1 = 1 / adjustedPriceToken1InToken0;

      console.log(
        `Price of token1 in terms of token0: ${adjustedPriceToken1InToken0}`
      );
      console.log(
        `Price of token0 in terms of token1: ${adjustedPriceToken0InToken1}`
      );

      return isToken0TradedToken.value
        ? adjustedPriceToken0InToken1
        : adjustedPriceToken1InToken0;
    };

    const startBot = async () => {
      console.clear();
      if (!initialValidation()) {
        addLog(
          "system: Initial validation failed. Please check the settings",
          null
        );
        return;
      }

      const isOK = await initThings();
      if (!isOK) {
        addLog(
          "system: Initialization failed. Please check the settings",
          null
        );
        return;
      }

      // await commonPeriodicalUpdates();
      // Delay execution of getNetWorth() by 15 seconds
      // setTimeout(async () => {
      //   await this.getNetWorth();
      // }, 5000);

      if (!startTimeStamp) {
        startTimeStamp = new Date().getTime();
        if (runningForInterval.value) {
          clearInterval(runningForInterval.value);
        }
        runningForInterval.value = setInterval(updateTimer, 60000);
      }
      isBotRunning.value = "Running";
      startStopToggle.value = true;
    };

    const stopBot = async () => {
      // Add bot stopping logic here
      if (watchTimeout.value !== null) {
        clearTimeout(watchTimeout.value);
      }
      if (runningForInterval.value !== null) {
        clearInterval(runningForInterval.value);
      }
      addLog("system: bot stopped");
    };

    const commonPeriodicalUpdates = async () => {
      console.log("periodical update...");
      if (!signer.value || !ethersProvider || !wethContract.value) {
        return;
      }

      balance.value = ethers.formatEther(
        await ethersProvider.getBalance(signer.value.getAddress())
      );
      console.log("balance ETH", balance.value);
      await sleep(200);

      balanceWETH.value = ethers.formatEther(
        await wethContract.balanceOf(signer.value.getAddress())
      );
      await sleep(200);
      console.log("balanceWETH", balanceWETH.value);

      balanceUSDC.value = ethers.formatUnits(
        await usdcContract.balanceOf(signer.value.getAddress()),
        6
      );
      await sleep(200);
      console.log("balanceUSDC", balanceUSDC.value);

      balanceUSDT.value = ethers.formatUnits(
        await usdtContract.balanceOf(signer.value.getAddress()),
        6
      );
      console.log("balanceUSDT", balanceUSDT.value);

      await sleep(200);
      await checkPlatinumSettings();

      if (!initialBalance.value) {
        initialBalance.value = balance.value;
      }
      if (!initialBalanceWETH.value) {
        initialBalanceWETH.value = balanceWETH.value;
      }
      if (!initialBalanceUSDC.value) {
        initialBalanceUSDC.value = balanceUSDC.value;
      }
      if (!initialBalanceUSDT.value) {
        initialBalanceUSDT.value = balanceUSDT.value;
      }

      if (boughtToken.value !== null) {
        tokenBoughtContract = new ethers.Contract(
          boughtToken.value.address,
          erc20ABI,
          signer.value
        );
        const bal = await tokenBoughtContract.balanceOf(
          signer.value.getAddress()
        );

        boughtToken.value.balance = ethers.formatUnits(
          bal,
          Number(boughtToken.value.decimals)
        );
        console.log("boughtToken.balance", boughtToken.value.balance);
      }
    };

    const checkPlatinumSettings = async () => {
      console.log("plan", plan.value);
      if (plan.value !== "PLATINUM") {
        return;
      }

      if (checkboxTradeOnlyETHHasGains === false) {
        return;
      }
      console.log("!! checking if ETH is on the rise !!");

      if (ethUsdPrice.value === 0) {
        const latestRoundData = await priceFeedContract.latestRoundData();
        const price = latestRoundData.answer;
        ethUsdPrice.value = Number(price / BigInt(10 ** 8));
      }

      if (lastUSDPrice.value === 0) {
        lastUSDPrice.value = ethUsdPrice.value;
        return;
      }
      if (lastUSDPrice.value > ethUsdPrice.value) {
        // eth is falling
        addLog(`system: eth is falling in price. $${ethUsdPrice.value}`, null);
        bigSellPauseUntil.value = Math.floor(Date.now() / 1000) + 120;
        lastUSDPrice.value = ethUsdPrice.value;
      }
    };

    const updateTimer = () => {
      const currentTimeStamp = new Date().getTime();
      const elapsedTime = currentTimeStamp - startTimeStamp;
      runningFor = Math.floor(elapsedTime / 60000);
      const hours = Math.floor(runningFor / 60);
      const minutes = runningFor % 60;
      formattedTime.value =
        hours < 1 ? `${minutes}min` : `${hours}h ${minutes}min`;
    };

    const handleStartStopToggle = () => {
      if (startStopToggle.value) {
        startBot();
      } else {
        stopBot();
      }
    };

    const closePosition = () => {};
    const loadLogs = () => {};

    onMounted(() => {
      initialValidation();
      takeProfitAtPercent = LocalStorage.getItem("takeProfitAtPercent") || 3;
      stopLossAtPercent = LocalStorage.getItem("stopLossAtPercent") || 2;
      wethAddress = (LocalStorage.getItem("wethAddress") || "")
        .toString()
        .toLocaleLowerCase();
      usdcAddress = (LocalStorage.getItem("usdcAddress") || "")
        .toString()
        .toLocaleLowerCase();
      usdtAddress = (LocalStorage.getItem("usdtAddress") || "")
        .toString()
        .toLocaleLowerCase();
      watchedTokens = LocalStorage.getItem("watchedTokens") || "";
      valueETHToBuy = LocalStorage.getItem("valueETHToBuy") || 0.0001;
      valueUSDToBuy = LocalStorage.getItem("valueUSDToBuy") || 5;
      minLiqudityETHAdded = LocalStorage.getItem("minLiqudityETHAdded") || 1;
      minUSDSold = LocalStorage.getItem("minUSDSold") || 3000;
      minETHSold = LocalStorage.getItem("minETHSold") || 1;
      watchedPool = LocalStorage.getItem("watchedPool") || "";
      ethUsdPriceFeedAddress =
        LocalStorage.getItem("ethUsdPriceFeedAddress") || "";

      checkboxTradeOnlyETHHasGains =
        LocalStorage.getItem("storedcheckboxTradeOnlyETHHasGains") || false;

      useUSDC = LocalStorage.getItem("useUSDC") || false;

      useUSDT = LocalStorage.getItem("useUSDT") || false;

      useWETH = LocalStorage.getItem("useWETH") || false;
      tradedToken = LocalStorage.getItem("tradedToken") || "";
      chainId = LocalStorage.getItem("chainId") || -1;

      simulationMode.value = LocalStorage.getItem("simulationMode") || false;

      checkboxPlaySoundOnBuy =
        LocalStorage.getItem("checkboxPlaySoundOnBuy") || false;
    });

    onUnmounted(() => {
      if (watchTimeout.value !== null) {
        clearTimeout(watchTimeout.value);
      }
      if (runningForInterval.value !== null) {
        clearInterval(runningForInterval.value);
      }
    });

    // Watchers
    watch(startStopToggle, (newVal) => {
      if (newVal) {
        addLog("Bot started");
        isBotRunning.value = "Running";
        handleStartStopToggle();
      } else {
        isBotRunning.value = "Paused";
        handleStartStopToggle();
      }
    });

    return {
      items,
      ellipsizeIt,
      isBotRunning,
      startStopToggle,
      isVLogDisabled,
      isExecutingBuy,
      isToken0TradedToken,
      startingNetWorth,
      netWorth,
      formattedTime,
      uniswapV3PoolABI,
      swapRouter02ABI,
      priceFeedABI,
      boughtToken,
      logItems,
      boughtWithToken,
      initialTokenPrice,
      currentTokenPrice,
      initialBalance,
      winCount,
      lossCount,
      balance,
      initialBalanceWETH,
      initialBalanceUSDC,
      initialBalanceUSDT,
      balanceWETH,
      balanceUSDC,
      balanceUSDT,
      vLogs,
      closePosition,
      loadLogs,
      running_for,
      runningForInterval,
      startTimeStamp,
      TRADED_TOKEN,
      EInterfaceV3,
      lastUSDPrice,
      ethUsdPrice,
      simulationMode,
      bigSellPauseUntil,
      percentageChange,
      poolFee,
      explorerURL,
      watchTimeout,
      swapRouterV2Interface,
      uniswapPoolv3Interface,
      signerAddress,
      token0,
      token0Symbol,
      token0Decimals,
      token1,
      token1Symbol,
      token1Decimals,
      web3Subscription,
      pauseSellAmount,
      pauseSeconds,
      plan,
      swapTopic,
      transferTopic,
    };
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
