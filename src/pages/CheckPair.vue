<template>
  <q-page class="q-pa-lg">
    <div class="row">
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-form @submit="getPairsAndReserves">
          <q-card-section>
            <div class="text-h6">Check for Pools & Reserves</div>
            <div class="text-normal">
              <br />Simple utility to check the pools & reserves before
              trading.<br /><br />Add the desired contract address to the pairs
              in settings
            </div>
          </q-card-section>
          <div class="q-pa-md">
            <q-input
              v-model="tokenAddress"
              outlined
              type="search"
              label="Token Contract Address"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <p class="q-mt-md text-caption">
              example: 0xff970a61a04b1ca14834a43f5de4533ebddb5cc8 is USDC in
              Arbitrum
            </p>
          </div>
          <div class="q-ma-md">
            <q-btn label="CHECK LP PAIRS" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card>
    </div>

    <div v-if="TargetToken" class="row">
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">Token Info</div>
          <div v-if="network" class="text-normal">
            Network: {{ network }} (Chain ID: {{ chainId }})
          </div>

          <div class="text-normal">
            Contract:
            <a
              target="_blank"
              :href="`${explorerURL}/address/${TargetToken.address}`"
              >{{ TargetToken.address }}</a
            >
          </div>
          <div class="text-normal">Name: {{ TargetToken.name }}</div>
          <div class="text-normal">Symbol: {{ TargetToken.symbol }}</div>
          <div class="text-normal">Decimals: {{ TargetToken.decimals }}</div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="poolWETH" class="row">
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">Pool WETH</div>

          <div class="text-normal">
            Pool Address:
            <a
              target="_blank"
              :href="`${explorerURL}/address/${poolWETH.address}`"
              >{{ poolWETH.address }}</a
            >
          </div>
          <div>
            Balances: {{ Number(poolWETH.balance_weth).toFixed(4) }} WETH,
            Balances: {{ Number(poolWETH.balance_token).toFixed(4) }}
            {{ TargetToken.symbol }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="poolUSDC" class="row">
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">Pool USDC</div>

          <div class="text-normal">
            Pool Address:
            <a
              target="_blank"
              :href="`${explorerURL}/address/${poolUSDC.address}`"
              >{{ poolUSDC.address }}</a
            >
          </div>
          <div>
            Balances: {{ Number(poolUSDC.balance_usdc).toFixed(4) }} USDC,
            Balances: {{ Number(poolUSDC.balance_token).toFixed(4) }}
            {{ TargetToken.symbol }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="poolUSDT" class="row">
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">Pool USDT</div>

          <div class="text-normal">
            Pool Address:
            <a
              target="_blank"
              :href="`${explorerURL}/address/${poolUSDT.address}`"
              >{{ poolUSDT.address }}</a
            >
          </div>
          <div>
            Balances: {{ Number(poolUSDT.balance_usdt).toFixed(4) }} USDT,
            Balances: {{ Number(poolUSDT.balance_token).toFixed(4) }}
            {{ TargetToken.symbol }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="ethPair" class="row">
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">{{ ethPair }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import { decryptAES, encryptAES, sha256 } from "../utils/encryption";
import { LocalStorage, useQuasar } from "quasar";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { uniswapV2ABI } from "../../data/uniswapv2";
import { uniswapV2PairABI } from "../../data/uniswapv2pair";
import { uniswapV2FactoryABI } from "../../data/uniswapv2factory";
import IUniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";
import { erc20ABI } from "../../data/erc20";
import { uniswapV3PoolABI } from "../../data/uniswapV3PoolABI";
import { swapRouter02ABI } from "../../data/swapRouter02ABI";
import { quoterV2ABI } from "../../data/quoterV2ABI";
import JSBI from "jsbi";
import {
  TradeType,
  Ether,
  ChainId,
  Token,
  CurrencyAmount,
  Percent,
} from "@uniswap/sdk-core";
import { Route, Trade as V2TradeSDK, Pair } from "@uniswap/v2-sdk";
import {
  Trade as V3TradeSDK,
  Route as RouteV3,
  Pool,
  nearestUsableTick,
  TickMath,
  TickListDataProvider,
  priceToClosestTick,
  Position,
  Tick,
  TICK_SPACINGS,
  FeeAmount,
} from "@uniswap/v3-sdk";
import {
  MixedRouteTrade,
  MixedRouteSDK,
  Trade as RouterTrade,
  RouteV2,
} from "@uniswap/router-sdk";
import { sign } from "crypto";

const $q = useQuasar();

let provider: ethers.WebSocketProvider;
let signer: ethers.Wallet;

// Reactive references
const tokenAddress = ref("");
const infoText = ref<string | null>(null);
const wethAddress = ref<string | null>(null);
const usdcAddress = ref<string | null>(null);
const usdtAddress = ref<string | null>(null);
const chainId = ref<number | null>(null);
const network = ref<string | null>(null);
const rpcURL = ref<string | null>(null);
const routerV2Address = ref<string | null>(null);
const routerV2FactoryAddress = ref<string | null>(null);
const explorerURL = ref<string | null>(null);
const pairAddress = ref<string | null>(null);
const reserve0 = ref<string | null>(null);
const reserve1 = ref<string | null>(null);
const ethPair = ref<any>(null);
const usdcPair = ref<any>(null);
const usdtPair = ref<any>(null);
const erc20Contract = ref<ethers.Contract | null>(null);
const poolBalanceToken = ref<string | null>(null);
const poolWETH = ref<any>(null);
const poolUSDC = ref<any>(null);
const poolUSDT = ref<any>(null);
const EInterfaceV3 = ref<any>(null);
const EInterfaceV2 = ref<any>(null);
const poolAddress = ref<string | null>(null);

const TargetToken = ref<Token | null>(null);

onMounted(async () => {
  rpcURL.value = LocalStorage.getItem("rpcURL");
  wethAddress.value = LocalStorage.getItem("wethAddress");
  usdcAddress.value = LocalStorage.getItem("usdcAddress");
  usdtAddress.value = LocalStorage.getItem("usdtAddress");
  routerV2Address.value = LocalStorage.getItem("routerV2Address");
  routerV2FactoryAddress.value = LocalStorage.getItem("routerV2FactoryAddress");
  explorerURL.value = LocalStorage.getItem("explorerURL");
  chainId.value = LocalStorage.getItem("chainId");
  EInterfaceV2.value = new ethers.Interface(uniswapV2ABI);

  provider = new ethers.WebSocketProvider(rpcURL.value as string, undefined, {
    staticNetwork: true,
  });

  network.value = (await provider.getNetwork()).name;
  chainId.value = Number((await provider.getNetwork()).chainId);

  // checking the balance
  const storedprivateKey = LocalStorage.getItem("privateKey") as string;
  const privateKey = decryptAES(storedprivateKey);

  try {
    signer = new ethers.Wallet(privateKey, provider);
  } catch (e) {
    $q.notify({
      message: "failed to decode private key",
      color: "red",
    });
    return false;
  }
});

const getPairsAndReserves = async () => {
  if (!initialValidation()) return;

  await getTokenInfo();

  // 1. get weth pair
  try {
    await getETHPoolInfo();
  } catch (error) {
    console.log(error);
  }

  // 2. get usdc pair
  try {
    await getUSDCPoolInfo();
  } catch (error) {
    console.log(error);
  }

  // 3. get usdt pair
  try {
    await getUSDTPoolInfo();
  } catch (error) {
    console.log(error);
  }
};

const getTokenInfo = async () => {
  if (String(tokenAddress.value).length < 25) {
    $q.notify({
      message: "missing or invalid token address",
      color: "red",
    });
    return {};
  }

  erc20Contract.value = new ethers.Contract(
    tokenAddress.value,
    erc20ABI,
    signer
  );

  const name = await erc20Contract.value.name();
  const symbol = await erc20Contract.value.symbol();
  const decimals = await erc20Contract.value.decimals();

  TargetToken.value = new Token(
    chainId.value as number,
    tokenAddress.value,
    Number(decimals),
    symbol,
    name
  );
};

const initialValidation = (): boolean => {
  if (!rpcURL.value) {
    $q.notify({
      message: "please set the RPC URL in settings before using this",
      color: "red",
    });
    return false;
  }

  const storedprivateKey = LocalStorage.getItem("privateKey");
  if (!storedprivateKey) {
    $q.notify({
      message:
        "there is no private key set. we use it to get the address and display the allowance",
      color: "red",
    });
    return false;
  }
  return true;
};

// pair with USDC
const getUSDCPoolInfo = async () => {
  if (!TargetToken.value) return;

  const USDCToken = new Token(
    chainId.value as number,
    usdcAddress.value as string,
    6,
    "USDC",
    "USDC"
  );

  const poolAddress = Pool.getAddress(
    TargetToken.value,
    USDCToken,
    FeeAmount.MEDIUM
  );

  console.log("usdc pool got address ", poolAddress);

  const poolBalanceToken = await erc20Contract.value?.balanceOf(poolAddress);

  console.log("poolBalanceToken ", poolBalanceToken);

  const erc20ContractUSDC = new ethers.Contract(
    usdcAddress.value as string,
    erc20ABI,
    signer
  );

  const poolBalanceUSDC = await erc20ContractUSDC.balanceOf(poolAddress);

  console.log("usdc poolBalanceUSDC ", poolBalanceUSDC);

  poolUSDC.value = {
    address: poolAddress,
    balance_token: ethers.formatUnits(
      poolBalanceToken,
      TargetToken.value.decimals
    ),
    balance_usdc: ethers.formatUnits(poolBalanceUSDC, 6),
  };
};

// pair with USDT
const getUSDTPoolInfo = async () => {
  if (!TargetToken.value) return;

  const USDTToken = new Token(
    chainId.value as number,
    usdtAddress.value as string,
    6,
    "USDT",
    "USDT"
  );

  const poolAddress = Pool.getAddress(
    TargetToken.value,
    USDTToken,
    FeeAmount.MEDIUM
  );

  console.log("usdt pool got address ", poolAddress);

  const poolBalanceToken = await erc20Contract.value?.balanceOf(poolAddress);

  console.log("poolBalanceToken ", poolBalanceToken);

  const erc20ContractUSDT = new ethers.Contract(
    usdtAddress.value as string,
    erc20ABI,
    signer
  );

  const poolBalanceUSDT = await erc20ContractUSDT.balanceOf(poolAddress);

  console.log("usdc poolBalanceUSDT ", poolBalanceUSDT);

  poolUSDT.value = {
    address: poolAddress,
    balance_token: ethers.formatUnits(
      poolBalanceToken,
      TargetToken.value.decimals
    ),
    balance_usdt: ethers.formatUnits(poolBalanceUSDT, 6),
  };
};

// pair with WETH
const getETHPoolInfo = async () => {
  if (!TargetToken.value) return;

  const WETHToken = new Token(
    chainId.value as number,
    wethAddress.value as string,
    18,
    "WETH",
    "Wrapped Ether"
  );

  const poolAddress = Pool.getAddress(
    TargetToken.value,
    WETHToken,
    FeeAmount.MEDIUM
  );

  console.log("weth pool got address ", poolAddress);

  const poolBalanceToken = await erc20Contract.value?.balanceOf(poolAddress);

  console.log("weth poolBalanceToken ", poolBalanceToken);

  const erc20ContractW = new ethers.Contract(
    wethAddress.value as string,
    erc20ABI,
    signer
  );

  const poolBalanceWETH = await erc20ContractW.balanceOf(poolAddress);

  console.log("weth poolBalanceWETH ", poolBalanceWETH);

  poolWETH.value = {
    address: poolAddress,
    balance_token: ethers.formatUnits(
      poolBalanceToken,
      TargetToken.value.decimals
    ),
    balance_weth: ethers.formatEther(poolBalanceWETH),
  };
};
</script>
