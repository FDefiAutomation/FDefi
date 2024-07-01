import Web3 from "web3";

let web3ProviderInstance: Web3 | null = null;

/**
 * Get an instance of the Web3 provider.
 * @param rpcURL - The RPC URL to connect to.
 * @returns An instance of `Web3`.
 */
export function getWeb3ProviderInstance(rpcURL: string): Web3 | null {
  if (!web3ProviderInstance) {
    const wsProvider = new Web3.providers.WebsocketProvider(rpcURL);
    web3ProviderInstance = new Web3(wsProvider);

    if (!wsProvider.supportsSubscriptions()) {
      console.error("Web3 provider doesn't support subscriptions");
      return null;
    }

    // wsProvider.on("connect", (err) => {
    //   if (err) {
    //     console.error("Web3 provider connection error:", err);
    //   } else {
    //     console.log(
    //       "Web3 provider connected to",
    //       web3ProviderInstance?.currentProvider
    //     );
    //   }
    // });

    // Handle provider disconnection
    wsProvider.on("disconnect", (err: any) => {
      console.error("Web3 provider disconnected:", err);
      // Optionally handle reconnection logic here
    });

    // Handle provider errors
    wsProvider.on("error", (err: any) => {
      console.error("Web3 RPC provider error:", err);
      // Optionally handle reconnection logic here
    });

    wsProvider.on("error", (err: any) => {
      console.error("Web3 instance error:", err);
      // Optionally handle reconnection logic here
    });

    return web3ProviderInstance;
  }
  return web3ProviderInstance;
}
