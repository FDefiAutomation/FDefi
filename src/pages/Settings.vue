<template>
  <q-page class="q-pa-lg">
    <div class="row">
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">General Settings</div>
        </q-card-section>
        <div class="q-pa-md">
          <q-form class="q-gutter-md">
            <q-input
              outlined
              v-model="valueETHToBuy"
              label="How much ETH to use for buying tokens"
              lazy-rules
            />

            <q-input
              outlined
              v-model="valueUSDToBuy"
              label="How much USD (usdt or usdc) to use for buying tokens"
              lazy-rules
            />

            <q-input
              outlined
              v-model="privateKey"
              label="Private Key"
              type="password"
              hint="starting with 0x"
              lazy-rules
            />

            <q-input
              outlined
              type="number"
              v-model="minLiqudityETHAdded"
              label="Trigger On Minimum Liquidity Value Added (ETH)"
              lazy-rules
            />

            <q-input
              outlined
              type="number"
              v-model="minUSDSold"
              label="Trigger On Minimum USD Sold"
              lazy-rules
            />

            <q-input
              outlined
              type="number"
              v-model="minETHSold"
              label="Trigger On Minimum ETH Sold"
              lazy-rules
            />

            <q-input
              outlined
              type="number"
              v-model="takeProfitAtPercent"
              label="Sell the token if it makes +x% price"
              lazy-rules
            />

            <q-input
              outlined
              type="number"
              v-model="stopLossAtPercent"
              label="Sell token if it loses more then -x% price"
              lazy-rules
            />
          </q-form>
        </div>
      </q-card>
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">Blockchain Settings</div>
        </q-card-section>
        <div class="q-pa-md">
          <q-form class="q-gutter-md">
            <q-input
              outlined
              v-model="rpcURL"
              label="RPC URL (wss://...)"
              hint="eg: wss://chaotic-solemn-night.quiknode.pro/1234567891234567/"
              lazy-rules
            />
            <p class="text-caption text-grey">
              A good options is quicknode. Please use this affiliate link please
              so we get a small payment at no additional cost from you
              <a
                target="_blank"
                href="https://www.quicknode.com/?via=blockchaintutorials"
                >quicknode website</a
              >
            </p>

            <q-select
              outlined
              v-model="blockchain"
              :options="supportedBlockchains"
              @update:model-value="updateBlockchain()"
              label="Select Blockchain"
            />

            <q-input
              outlined
              v-model="wethAddress"
              label="WETH Address"
              lazy-rules
            />

            <q-input
              outlined
              v-model="usdcAddress"
              label="USDC Address"
              lazy-rules
            />

            <q-input
              outlined
              v-model="usdtAddress"
              label="USDT Address"
              lazy-rules
            />
            <p style="font-size: 0.8em">
              See
              <a
                target="_blank"
                href="https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1"
              >
                docs.chain.link/data-feeds</a
              >
            </p>
            <q-input
              outlined
              v-model="ethUsdPriceFeedAddress"
              label="ETH/USD Price Feed Address"
              lazy-rules
            />

            <q-input
              outlined
              v-model="explorerURL"
              label="Explorer URL"
              lazy-rules
            />

            <q-checkbox v-model="useWETH" label="Use WETH" />
            <q-checkbox v-model="useUSDC" label="Use USDC" />
            <q-checkbox v-model="useUSDT" label="Use USDT" />
          </q-form>
        </div>
      </q-card>
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">Other Settings</div>
        </q-card-section>
        <div class="q-pa-md">
          <q-form class="q-gutter-md">
            <q-toggle
              v-model="simulationMode"
              checked-icon="check"
              color="blue"
              label="(Simulation) Does everything except the transactions"
              unchecked-icon="clear"
            />

            <q-checkbox
              v-model="checkboxPlaySoundOnBuy"
              label="Play Sound on Buy"
            />
          </q-form>
        </div>
      </q-card>

      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">Pool to Watch</div>

          <div class="q-pa-md">
            <p>
              The Uniswap Pool to watch for events. Only WETH/USDC/USDT pairs
            </p>

            <p v-if="watchedPool">
              Pool:

              <a target="_blank" :href="`${explorerURL}/address/${watchedPool}`"
                ><span class="text-bold">{{ watchedPool }}</span>
              </a>
            </p>

            <p v-if="tradedToken">
              Traded Token:
              <a target="_blank" :href="`${explorerURL}/token/${tradedToken}`"
                ><span class="text-bold">{{ tradedToken }}</span>
              </a>
            </p>

            <q-btn
              label="CHECK Liquidity"
              @click="$router.push('/checkpair')"
              class="q-ma-xs"
              type="submit"
              outline
              size="sm"
              color="black"
            />
            <q-btn
              label="EDIT POOL & TRADED TOKEN"
              @click="editWatchedPool"
              class="q-ma-xs"
              type="submit"
              outline
              size="sm"
              color="black"
            />
          </div>
        </q-card-section>
      </q-card>

      <q-card
        flat
        bordered
        class="bg-amber-12 my-card q-ma-md"
        style="width: 500px"
      >
        <q-card-section>
          <div class="text-h6">
            Gold Plan
            <span v-if="plan === 'BASIC'"
              ><i class="q-pa-xs material-icons">lock</i></span
            >
          </div>
        </q-card-section>

        <div class="q-pa-md">
          <q-form class="q-gutter-md">
            <p>
              <i class="q-pa-xs material-icons text-green">check_circle</i>
              Avoid buying when there are big selling events. Amount is in the
              input token (WETH, USDC, USDT formatted)
            </p>

            <div class="row">
              <div>
                <q-input
                  outlined
                  type="number"
                  v-model="pauseSellAmount"
                  class="q-ma-xs"
                  label="Sell amount"
                  lazy-rules
                />
              </div>
              <div>
                <q-input
                  outlined
                  class="q-ma-xs"
                  type="number"
                  v-model="pauseSeconds"
                  label="Pause seconds"
                  lazy-rules
                />
              </div>
            </div>

            <q-checkbox
              v-model="checkboxPauseOnPriceDrops"
              label="Pause on price drops"
            />
          </q-form>

          <div class="row">
            <p>
              <i class="q-pa-xs material-icons text-green">check_circle</i>
              Access to strategies page where there are concrete examples how to
              set it up for optimised results.
            </p>
          </div>
          <div class="row">
            <p>
              <i class="q-pa-xs material-icons text-green">check_circle</i>
              Chat Support
            </p>
          </div>
        </div>
      </q-card>

      <q-card
        flat
        bordered
        class="my-card bg-grey-8 q-ma-md"
        style="width: 500px"
      >
        <q-card-section>
          <div class="text-h6 text-white">
            Platinum Plan
            <span v-if="plan !== 'PLATINUM'"
              ><i class="q-pa-xs material-icons">lock</i></span
            >
          </div>
        </q-card-section>
        <div class="q-pa-md text-white">
          <p class="q-mt-md">
            <i class="q-pa-xs material-icons text-green">check_circle</i>
            Checks for price % change every 5 seconds instead of every 60
            seconds (setting applied automatically)
          </p>

          <p>
            <i class="q-pa-xs material-icons text-green">check_circle</i>
            delay the trade if ETH is falling in price (according to Chainlink
            oracle)
          </p>

          <q-checkbox
            v-model="checkboxTradeOnlyETHHasGains"
            label="Trade only when ETH has gains"
          />
          <br />

          <div class="row">
            <p>
              <i class="q-pa-xs material-icons text-green">check_circle</i>
              Access to strategies page where there are concrete examples how to
              set it up for optimised results.
            </p>
            <p>
              <i class="q-pa-xs material-icons text-green">check_circle</i>
              Chat & Phone Support
            </p>
          </div>
        </div>
      </q-card>

      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <q-card-section>
          <div class="text-h6">Upgrade Settings</div>
        </q-card-section>
        <div class="q-pa-md">
          <q-form class="q-gutter-md">
            <p>
              Plan: <span style="font-weight: bold">{{ plan }}</span>
            </p>
            <p v-if="plan === 'PLATINUM'">you are upgraded to maximum level</p>
            <q-input
              v-if="!plan || plan === 'BASIC' || plan === 'GOLD'"
              outlined
              v-model="upgradeKey"
              label="upgrade key"
              lazy-rules
            />

            <div
              v-if="!plan || plan === 'BASIC' || plan === 'GOLD'"
              style="margin-top: 10px"
            >
              <q-btn
                label="UPGRADE PLAN"
                @click="upgradePlan"
                outline
                size="sm"
                color="blue"
              />
            </div>
          </q-form>
        </div>
      </q-card>
      <q-card flat bordered class="my-card q-ma-md" style="width: 500px">
        <div class="q-ma-md">
          <q-btn
            label="SAVE SETTINGS"
            size="lg"
            @click="saveSettings"
            color="primary"
          />
        </div>
      </q-card>
    </div>

    <q-dialog v-model="watchedPoolDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Pool Address To Watch</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Pool Address to Watch. Add only ETH/USDT/USDC pools</p>
          <q-input dense outlined v-model="watchedPool" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Traded Token</p>
          <q-input dense outlined v-model="tradedToken" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Save Trade Watchlist"
            @click="saveWatchedPool"
            v-close-popup
          />
        </q-card-actions>
        <q-card-section>
          <p>Examples:</p>
          <p class="text-caption">
            Arbitrum: ETH/ARB pool: 0xc6f780497a95e246eb9449f5e4770916dcd6396a,
            traded token: 0x912ce59144191c1204e64559fe8253a0e49e6548
          </p>
          <p class="text-caption">
            Arbitrum: WBTC/ETH pool: 0x2f5e87C9312fa29aed5c179E456625D79015299c,
            traded token: 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f
          </p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
//wss://withered-flashy-meadow.arbitrum-mainnet.quiknode.pro/e2bb3691b652f27e4c8b422c3eeb99c3e09734d4/
//wss://boldest-light-sun.arbitrum-mainnet.quiknode.pro/118380ad60907b6071f8da79dd2528d9534dba85/
// console.log(String(CryptoJS.SHA256("g123r3*&@!@!2kl1239dfsaj121")));
// console.log(String(CryptoJS.SHA256("pkgf(#)@(@)@##(121fdfsaj121")));
// private key: 0xcd4175753ad85241ec532dce20664800302279ae9cdd7f76bacc299667fb4cfd

import { ref, onMounted, defineComponent } from "vue";
import { ethers } from "ethers";
import { LocalStorage, useQuasar } from "quasar";
import dingSound from "../assets/ding.mp3";
import { decryptAES, encryptAES, sha256 } from "../utils/encryption";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    let provider: ethers.WebSocketProvider;
    let signer: ethers.Wallet;
    const plan = ref("BASIC");
    const rpcURL = ref<string | null>("");
    const privateKey = ref<string | null>("");
    const simulationMode = ref(true);
    const takeProfitAtPercent = ref<string | null>("3");
    const stopLossAtPercent = ref<string | null>("2");
    const routerV3Address = ref<string | null>("");
    const blockchain = ref<string | null>("");
    const supportedBlockchains = [
      "ETH Mainnet",
      "Avax",
      "Arbitrum",
      "Bnb",
      "Base",
      "Optimism",
      "Polygon",
    ];
    const wethAddress = ref<string | null>("");
    const usdcAddress = ref<string | null>("");
    const usdtAddress = ref<string | null>("");
    const ethUsdPriceFeedAddress = ref<string | null>("");
    const slippage = ref(1);
    const pauseSellAmount = ref(100);
    const pauseSeconds = ref(120);
    const checkboxPauseOnPriceDrops = ref(false);
    const routerV2FactoryAddress = ref<string | null>("");
    const valueETHToBuy = ref(1);
    const valueUSDToBuy = ref(1);
    const explorerURL = ref<string | null>("");
    const useWETH = ref(true);
    const useUSDC = ref(false);
    const useUSDT = ref(false);
    const minLiqudityETHAdded = ref(10);
    const minUSDSold = ref(5000);
    const minETHSold = ref(2);
    const checkboxPlaySoundOnBuy = ref(false);
    const checkboxTradeOnlyETHHasGains = ref(false);
    const watchedPool = ref<string | null>("");
    const tradedToken = ref<string | null>("");
    const watchedPoolDialog = ref(false);
    const upgradeKey = ref<string | null>("");
    const PLAN_GOLD_SHA_OF_KEY =
      "8437217bd462917dae8b1b3c4d73222f312d1dc80c4b1c6c96571ab912a81f43";
    const PLAN_PLATINUM_SHA_OF_KEY =
      "89e7141584650a3b2a780d7276526c84d48cb09960cbc0ae54de873d80d00640";
    onMounted(() => {
      console.log("settings mounted called");

      rpcURL.value = LocalStorage.getItem("rpcURL") as string | null;
      const storedPrivateKey = LocalStorage.getItem("privateKey") as
        | string
        | null;
      if (storedPrivateKey) {
        privateKey.value = decryptAES(storedPrivateKey);
      }

      const storedTakeProfit = LocalStorage.getItem("takeProfitAtPercent");
      takeProfitAtPercent.value = storedTakeProfit
        ? storedTakeProfit.toString()
        : "3";
      if (storedTakeProfit === null || storedTakeProfit === "") {
        LocalStorage.set("takeProfitAtPercent", "3");
      }

      const storedStopLoss = LocalStorage.getItem("stopLossAtPercent");
      stopLossAtPercent.value = storedStopLoss
        ? storedStopLoss.toString()
        : "2";
      if (storedStopLoss === null || storedStopLoss === "") {
        LocalStorage.set("stopLossAtPercent", "2");
      }

      blockchain.value = LocalStorage.getItem("blockchain") as string | null;
      wethAddress.value = LocalStorage.getItem("wethAddress") as string | null;
      usdcAddress.value = LocalStorage.getItem("usdcAddress") as string | null;
      usdtAddress.value = LocalStorage.getItem("usdtAddress") as string | null;
      ethUsdPriceFeedAddress.value = LocalStorage.getItem(
        "ethUsdPriceFeedAddress"
      ) as string | null;
      watchedPool.value = LocalStorage.getItem("watchedPool") as string | null;
      tradedToken.value = LocalStorage.getItem("tradedToken") as string | null;
      valueETHToBuy.value = Number(LocalStorage.getItem("valueETHToBuy") || 1);
      valueUSDToBuy.value = Number(LocalStorage.getItem("valueUSDToBuy") || 1);
      minLiqudityETHAdded.value = Number(
        LocalStorage.getItem("minLiqudityETHAdded") || 10
      );
      minUSDSold.value = Number(LocalStorage.getItem("minUSDSold") || 5000);
      minETHSold.value = Number(LocalStorage.getItem("minETHSold") || 2);
      explorerURL.value = LocalStorage.getItem("explorerURL") as string | null;
      pauseSellAmount.value = Number(
        LocalStorage.getItem("pauseSellAmount") || 100
      );
      pauseSeconds.value = Number(LocalStorage.getItem("pauseSeconds") || 120);
      checkboxPauseOnPriceDrops.value = Boolean(
        LocalStorage.getItem("checkboxPauseOnPriceDrops")
      );
      checkboxPlaySoundOnBuy.value = Boolean(
        LocalStorage.getItem("checkboxPlaySoundOnBuy")
      );
      simulationMode.value = Boolean(LocalStorage.getItem("simulationMode"));
      useWETH.value = Boolean(LocalStorage.getItem("useWETH"));
      useUSDC.value = Boolean(LocalStorage.getItem("useUSDC"));
      useUSDT.value = Boolean(LocalStorage.getItem("useUSDT"));
      checkboxTradeOnlyETHHasGains.value = Boolean(
        LocalStorage.getItem("checkboxTradeOnlyETHHasGains")
      );

      const storedPlan = LocalStorage.getItem("plan") as string | null;

      plan.value = storedPlan ? decryptAES(storedPlan) : "BASIC";
      if (storedPlan === null || storedPlan === "") {
        LocalStorage.set("plan", encryptAES("BASIC"));
      }
    });

    function updateBlockchain() {
      LocalStorage.set("blockchain", blockchain.value);
      switch (blockchain.value) {
        case "ETH Mainnet":
          explorerURL.value = "https://etherscan.io";
          wethAddress.value = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
          usdcAddress.value = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
          usdtAddress.value = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
          ethUsdPriceFeedAddress.value =
            "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
          break;
        case "Avax":
          explorerURL.value = "https://snowtrace.io";
          wethAddress.value = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
          usdcAddress.value = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
          usdtAddress.value = "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7";
          ethUsdPriceFeedAddress.value =
            "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
          break;
        case "Arbitrum":
          explorerURL.value = "https://arbiscan.io";
          wethAddress.value = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
          usdcAddress.value = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
          usdtAddress.value = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
          ethUsdPriceFeedAddress.value =
            "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612";
          break;
        case "Bnb":
          explorerURL.value = "https://bscscan.com";
          wethAddress.value = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
          usdcAddress.value = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
          usdtAddress.value = "0x55d398326f99059fF775485246999027B3197955";
          ethUsdPriceFeedAddress.value =
            "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e";
          break;
        case "Base":
          explorerURL.value = "https://basescan.org";
          wethAddress.value = "0x4200000000000000000000000000000000000006";
          usdcAddress.value = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
          usdtAddress.value = "0x0000000000000000000000000000000000000000";
          ethUsdPriceFeedAddress.value =
            "0xBc2062b7a190be593d8D33b019c11B38937278a0";
          break;
        case "Optimism":
          explorerURL.value = "https://optimistic.etherscan.io";
          wethAddress.value = "0x4200000000000000000000000000000000000006";
          usdcAddress.value = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607";
          usdtAddress.value = "0x0000000000000000000000000000000000000000";
          ethUsdPriceFeedAddress.value =
            "0x13e3Ee699D1909E989722E753853AE30b17e08c5";
          break;
        case "Polygon":
          explorerURL.value = "https://polygonscan.com";
          wethAddress.value = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
          usdcAddress.value = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
          usdtAddress.value = "0xC2132D05D31c914A87C6611C10748AEb04B58e8F";
          ethUsdPriceFeedAddress.value =
            "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0";
          break;
      }
      LocalStorage.set("wethAddress", wethAddress.value);
      LocalStorage.set("usdcAddress", usdcAddress.value);
      LocalStorage.set("usdtAddress", usdtAddress.value);
      LocalStorage.set("explorerURL", explorerURL.value);
      LocalStorage.set("ethUsdPriceFeedAddress", ethUsdPriceFeedAddress.value);
    }

    function playSound() {
      if (checkboxPlaySoundOnBuy.value) {
        const audio = new Audio(dingSound);
        audio.play();
      }
    }

    function editWatchedPool() {
      watchedPool.value = LocalStorage.getItem("watchedPool");
      tradedToken.value = LocalStorage.getItem("tradedToken");
      watchedPoolDialog.value = true;
    }

    function saveWatchedPool() {
      if (String(watchedPool.value).length < 1) {
        $q.notify({
          message: "you can use the pairs info page to get some info",
          color: "orange",
        });
      }
      LocalStorage.set(
        "watchedPool",
        String(watchedPool.value).toLocaleLowerCase()
      );
      LocalStorage.set(
        "tradedToken",
        String(tradedToken.value).toLocaleLowerCase()
      );

      $q.notify({ message: "pool & traded token saved", color: "blue" });
    }

    async function saveSettings() {
      try {
        LocalStorage.set("rpcURL", rpcURL.value);
        LocalStorage.set("privateKey", encryptAES(privateKey.value!));
        LocalStorage.set("blockchain", blockchain.value);
        LocalStorage.set("wethAddress", wethAddress.value);
        LocalStorage.set("usdcAddress", usdcAddress.value);
        LocalStorage.set("usdtAddress", usdtAddress.value);
        LocalStorage.set("stopLossAtPercent", stopLossAtPercent.value);
        LocalStorage.set("takeProfitAtPercent", takeProfitAtPercent.value);
        LocalStorage.set("valueETHToBuy", valueETHToBuy.value);
        LocalStorage.set("valueUSDToBuy", valueUSDToBuy.value);
        LocalStorage.set("minLiqudityETHAdded", minLiqudityETHAdded.value);
        LocalStorage.set("minUSDSold", minUSDSold.value);
        LocalStorage.set("minETHSold", minETHSold.value);
        LocalStorage.set("useWETH", useWETH.value);
        LocalStorage.set("useUSDC", useUSDC.value);
        LocalStorage.set("useUSDT", useUSDT.value);
        LocalStorage.set("explorerURL", explorerURL.value);
        LocalStorage.set(
          "checkboxPlaySoundOnBuy",
          checkboxPlaySoundOnBuy.value
        );
        LocalStorage.set("simulationMode", simulationMode.value);
        LocalStorage.set(
          "ethUsdPriceFeedAddress",
          ethUsdPriceFeedAddress.value
        );
      } catch (err) {
        console.log(err);
        $q.notify({ message: "failed to save settings", color: "red" });
        return;
      }

      if (checkboxPlaySoundOnBuy.value) {
        const audio = new Audio(dingSound);
        audio.play();
      }

      if (plan.value === "GOLD" || plan.value === "PLATINUM") {
        LocalStorage.set("pauseSellAmount", pauseSellAmount.value);
        LocalStorage.set("pauseSeconds", pauseSeconds.value);
        LocalStorage.set(
          "checkboxPauseOnPriceDrops",
          checkboxPauseOnPriceDrops.value
        );
      }

      if (plan.value === "PLATINUM") {
        try {
          LocalStorage.set(
            "checkboxTradeOnlyETHHasGains",
            checkboxTradeOnlyETHHasGains.value
          );
        } catch (err) {
          console.log(err);
          $q.notify({
            message: "failed to save platinum settings",
            color: "red",
          });
          return;
        }
      }

      try {
        provider = new ethers.WebSocketProvider(rpcURL.value!, undefined, {
          staticNetwork: true,
        });
        const network = await provider.getNetwork();
        const chainId = parseInt(network.chainId.toString());
        console.log("chainId detected", chainId);
        LocalStorage.set("chainId", chainId);
      } catch (error) {
        console.log("error getting the network", error);
        $q.notify({ message: String(error), color: "red" });
        return;
      }

      const storedPrivateKey = LocalStorage.getItem("privateKey");
      const decryptedPrivateKey = decryptAES(storedPrivateKey as string);
      try {
        signer = new ethers.Wallet(decryptedPrivateKey, provider);
      } catch (e) {
        console.log("error getting the private key", e);
        // replace addLog with a logging function
        console.log("system: failed to decode private key");
        return false;
      }

      let balance = ethers.formatEther(
        await provider.getBalance(signer.address)
      );
      console.log("wallet eth balance", balance);

      $q.notify({ message: "settings saved", color: "green" });
      if (provider) {
        provider.removeAllListeners();
      }
    }

    function upgradePlan() {
      let isKeyValid = false;

      if (String(sha256(upgradeKey.value!)) === PLAN_GOLD_SHA_OF_KEY) {
        try {
          LocalStorage.set("plan", encryptAES("GOLD"));
          plan.value = "GOLD";
          $q.notify({ message: "Plan Upgraded to GOLD", color: "blue" });
          isKeyValid = true;
          return;
        } catch (e) {
          console.log(e);
        }
      }

      if (String(sha256(upgradeKey.value!)) === PLAN_PLATINUM_SHA_OF_KEY) {
        try {
          LocalStorage.set("plan", encryptAES("PLATINUM"));
          plan.value = "PLATINUM";
          $q.notify({
            message: "Plan Upgraded to PLATINUM",
            color: "blue",
          });
          isKeyValid = true;
          return;
        } catch (e) {
          console.log(e);
        }
      }

      if (!isKeyValid) {
        $q.notify({ message: "invalid upgrade key", color: "red" });
      }
    }

    return {
      plan,
      rpcURL,
      privateKey,
      simulationMode,
      takeProfitAtPercent,
      stopLossAtPercent,
      routerV3Address,
      blockchain,
      supportedBlockchains,
      wethAddress,
      usdcAddress,
      usdtAddress,
      ethUsdPriceFeedAddress,
      slippage,
      pauseSellAmount,
      pauseSeconds,
      checkboxPauseOnPriceDrops,
      routerV2FactoryAddress,
      valueETHToBuy,
      valueUSDToBuy,
      explorerURL,
      useWETH,
      useUSDC,
      useUSDT,
      minLiqudityETHAdded,
      minUSDSold,
      minETHSold,
      checkboxPlaySoundOnBuy,
      checkboxTradeOnlyETHHasGains,
      watchedPool,
      tradedToken,
      watchedPoolDialog,
      upgradeKey,
      updateBlockchain,
      encryptAES,
      decryptAES,
      playSound,
      editWatchedPool,
      saveSettings,
      upgradePlan,
      saveWatchedPool,
    };
  },
});
</script>
