<template>
  <q-page class="q-pa-lg">
    <div class="text-h3">Help & How It Works</div>
    <div class="q-ma-md">
      <p class="title q-mt-lg bg-red text-white q-pa-md">
        Read all this page this very carefully
      </p>
      <p class="description">
        There are many trading bot scams: iEarn, Bitconnect, Mirror Trading
        International. They all promised you will get rich having the bot do the
        work while you sleep. This is how this bot is diffrent: - the WaLi bot
        doesn't guarantee any income, in fact if you configure it badly you will
        lose money.
        <br />
        We do not track our users in any way
      </p>
      <p class="title q-mt-lg">Quick overview</p>
      <p class="description">
        The app is connected to the blockchain directly (thought the RPC
        connection from your node) and to moralis api (only premium accounts).
        We do not have a backend, a central "server" running some "AI" that does
        the trading. There is no such thing because if there were, people using
        it won't be selling it.
        <br />
        The bot scans for big amount transactions happening on your preferred
        tokens that whales do. The idea is that if a whale buys big a token,
        they must know something that we (small fish) don't. In case such
        transactions happen, the bot will buy the token. After that the bot
        monitors the price increase/decrease. If the price is over 3% (or
        whatever you configure it as sell %) it sells, if the price falls below
        1% (or whatever you configure) it will also sell.
        <br />
        Does this strategy works? Sometimes yes, sometimes no. It depends on the
        token, the market conditions etc. Do your own reaserch!
      </p>

      <p class="title">Security Considerations</p>
      <p class="description">
        From the start the app was designed to communicate only with the
        blockchain. For the Platinum Plan (if you have it) you also need a
        moralis.io connection. Besides this we do not have a backend, we do not
        track you, put you to login, take your credit card or other shit.
        Because the app is not reliant on an external API it is suggested that
        you have the following setup:
      </p>
      <p class="description">
        A freshly installed linux (any ubuntu based variant will do) on a laptop
        or VM (any hardware will do and the bot consumes few hardware resources)
        <br />Do not install any other programs on it<br />Firewall every other
        connection except the one that connects to your RPC and moralis (for
        platinum plan)
      </p>
      <p class="description">
        Running it on a clean mac has medium security risks and running it on
        windows (even cleaned) has high security risks. If you have torrents,
        cracked apps your funds will be stolen sooner or later.
      </p>
      <p class="description">
        Be careful of people posing as official support on our social media.
        Never run teamviewer or screensharing or scripts/apps from anyone in
        discord or you will lose all your money.
      </p>
      <p class="description">
        Double check that the download link for the bot is coming from our
        website. Do an sha256 checksum of the zipped file after you download it
        and compare it to the one on the website.
      </p>
      <p class="title">How do I know you will not steal my money</p>
      <p class="description">
        1. we are a real company with a real location, you are welcome to come
        and say hello in person and even look in the source code if you know
        programming<br />2. you can buy this bot with real money if you want to.
        <br />3. like we said before, the app only connect to the blockchain
        (and moralis API) so it would be hard for us to access your private key
        <br />4. we do not promise you'll make money from this bot, in fact it
        all depends on the settings you use
        <br />
        5. We save each version's source code alongside with hashes so we can
        prove that we don't include mallware / trojans etc in the code in case
        there is a legal dispute.
      </p>

      <p class="title">I still don't trust you</p>
      <p class="description">
        Trust should be gained. Unless you compute with pen & paper the
        transaction signatures that you do for crypto you have to trust some
        things. You trust the operating system of your computer? You trust
        trezor/ledger or other hardware wallets metamsk or whatever wallet you
        use.
        <br />
        Start with very little money on some layer 2 blockchain (at the time of
        writing this a swap transaction on arbitrum costs $0.005), see if this
        bot is making you money, stop using it if it doesn't.
      </p>

      <p class="title">Other tips to avoid losing money</p>
      <p class="description">
        1. until you get used with the bot, don't put lots of money in it.<br />
        2. start with a l2 blockchain (ex: Arbitrum) because fees on ethereum
        mainnet are sometimes very high<br />3. make sure that the tokens you
        watch are solid <br />4. start with tokens that have high liquidity &
        trade volume<br />
        5. Don't get greedy. Sell around 3% gain <br />6. Use a good RPC
        connection (websocket is needed)<br />
        6. Be careful with shitcoins / memecoins and other obscure tokens.
        Sometimes the bot cannot sell because of some reasons (tax on sell,
        scams etc), in that case it will ring a sound and will stop, you must do
        the swap manually and check what is wrong.
      </p>
      <p class="title">Other things</p>
      <p class="description">
        1.
        <span style="color: yellow; padding: 6px; background-color: black"
          >Always start with a clean wallet!</span
        >, only holding a small amount of ETH, WETH (or USDC, USDT if you target
        such pools) and without holding your target token. <br />2. Don't ask us
        with what tokens to configure it. If we would know this we would not be
        selling this bot<br />
        3. We recommend QuickNode RPCs connections:
        <a
          href="https://www.quicknode.com/?via=blockchaintutorials"
          target="_blank"
          >quicknode link</a
        >
        Please use this affiliate link please so we get a small payment at no
        additional cost from you <br />4. For super low latency results use your
        own hosted node <br />5. Wallet net worth is eth (in usd) + weth (in
        usd) + usdc + usdt and doesn't include any other tokens.
      </p>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "Liqui Bot",
});
</script>
<script>
export default {
  methods: {},
};
</script>
<style scoped>
.title {
  font-weight: bold;
  font-size: 1.2em;
}
</style>
