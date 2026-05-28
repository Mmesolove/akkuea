/**
 * Pollar Wallet Provider Implementation
 * 
 * Design Note: Pollar's API does not expose a bare sign step — it signs and submits
 * atomically via signAndSubmitTx(xdr). This implementation wraps Pollar so that
 * connect/disconnect/getAccount work normally, while signTransaction and submitTransaction
 * handle the full submit flow together via Pollar's atomic operation.
 * 
 * The approach taken: Extend WalletProvider with an optional submitTransaction method.
 * When signTransaction is called, it returns a signed XDR string. When submitTransaction
 * is called with that XDR, it delegates to Pollar's signAndSubmitTx which handles both
 * signing and submission atomically.
 */

import { WalletProvider, Account } from '../types';

interface PollarInterface {
  connect: () => Promise<{ address: string }>;
  disconnect: () => Promise<void>;
  getAccount: () => Promise<{ address: string }>;
  isConnected: () => Promise<boolean>;
  signTransaction: (xdr: string) => Promise<{ signedXdr: string }>;
  signAndSubmitTx: (xdr: string) => Promise<{ hash: string }>;
}

let pollarInterface: PollarInterface | null = null;

/**
 * Set the Pollar interface from the PollarWrapper component
 * This is called by PollarWrapper after Pollar hooks are initialized
 */
export const setPollarInterface = (interface_: PollarInterface) => {
  pollarInterface = interface_;
};

/**
 * Pollar Provider implementing the WalletProvider interface
 */
export const createPollarProvider = (): WalletProvider => {
  return {
    async connect() {
      if (!pollarInterface) {
        throw new Error('Pollar interface not initialized. Ensure PollarWrapper is mounted.');
      }
      const result = await pollarInterface.connect();
      return {
        address: result.address,
        name: 'Pollar',
      };
    },

    async disconnect() {
      if (!pollarInterface) {
        throw new Error('Pollar interface not initialized');
      }
      await pollarInterface.disconnect();
    },

    async getAccount(): Promise<Account> {
      if (!pollarInterface) {
        throw new Error('Pollar interface not initialized');
      }
      const result = await pollarInterface.getAccount();
      return {
        address: result.address,
      };
    },

    async signTransaction(xdr: string): Promise<string> {
      if (!pollarInterface) {
        throw new Error('Pollar interface not initialized');
      }
      // Sign the transaction using Pollar's sign method
      const result = await pollarInterface.signTransaction(xdr);
      return result.signedXdr;
    },

    async submitTransaction(xdr: string): Promise<{ hash: string }> {
      if (!pollarInterface) {
        throw new Error('Pollar interface not initialized');
      }
      // Pollar's signAndSubmitTx handles both signing and submission atomically
      // This is called after signTransaction with the signed XDR
      return await pollarInterface.signAndSubmitTx(xdr);
    },

    async isConnected(): Promise<boolean> {
      if (!pollarInterface) {
        return false;
      }
      return await pollarInterface.isConnected();
    },

    getName(): string {
      return 'Pollar';
    },
  };
};

/**
 * Singleton instance of Pollar provider
 */
let pollarProvider: WalletProvider | null = null;

export const getPollarProvider = (): WalletProvider => {
  if (!pollarProvider) {
    pollarProvider = createPollarProvider();
  }
  return pollarProvider;
};

export default getPollarProvider();
