/**
 * WalletProvider Interface
 * Provides a unified interface for different wallet providers (Stellar Wallets Kit, Pollar, etc.)
 */

export interface Account {
  address: string;
}

export interface WalletProvider {
  /**
   * Connect to the wallet
   * @returns Promise with address and wallet name
   */
  connect(): Promise<{ address: string; name: string }>;

  /**
   * Disconnect from the wallet
   */
  disconnect(): Promise<void>;

  /**
   * Get the currently connected account
   * @returns Promise with the current account address
   */
  getAccount(): Promise<Account>;

  /**
   * Sign a transaction
   * @param xdr The transaction XDR string to sign
   * @returns Promise with the signed transaction XDR string
   */
  signTransaction(xdr: string): Promise<string>;

  /**
   * (Optional) Submit a signed transaction to the network
   * Used by providers like Pollar that handle both signing and submission
   * @param xdr The signed transaction XDR string to submit
   * @returns Promise with the transaction hash
   */
  submitTransaction?(xdr: string): Promise<{ hash: string }>;

  /**
   * Check if wallet is currently connected
   * @returns Promise resolving to connection status
   */
  isConnected(): Promise<boolean>;

  /**
   * Get the name/ID of the wallet provider
   */
  getName(): string;
}
