import { ethers } from "ethers";

let providerInstance: ethers.WebSocketProvider | null = null;

/**
 * Get an instance of the Ethers WebSocket provider.
 * @param rpcURL - The RPC URL to connect to.
 * @returns An instance of `ethers.providers.WebSocketProvider`.
 */
export function getEthersProviderInstance(
  rpcURL: string
): ethers.WebSocketProvider {
  if (!providerInstance) {
    providerInstance = new ethers.WebSocketProvider(rpcURL, undefined, {
      staticNetwork: true,
    });

    // Handle provider errors
    providerInstance.on("error", (err: any) => {
      console.error("ethers RPC provider error:", err);
      // Reconnect to provider after 200ms
      setTimeout(() => getEthersProviderInstance(rpcURL), 200);
    });
  }
  return providerInstance;
}
