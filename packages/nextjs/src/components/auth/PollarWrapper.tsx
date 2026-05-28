'use client';

/**
 * PollarWrapper Component
 * 
 * Integrates Pollar wallet provider with the application by:
 * 1. Initializing Pollar context via usePollar hook
 * 2. Exposing Pollar functionality through WalletProvider interface
 * 3. Setting the Pollar interface for the pollar provider to use
 */

import React, { useEffect } from 'react';
import { usePollar } from '@pollar/react';
import { setPollarInterface } from '@/services/wallet/providers/pollar';

interface PollarWrapperProps {
  children: React.ReactNode;
}

export function PollarWrapper({ children }: PollarWrapperProps) {
  const pollar = usePollar();

  useEffect(() => {
    if (pollar) {
      // Set the Pollar interface for the provider to use
      setPollarInterface({
        connect: async () => {
          try {
            // Pollar's login method handles authentication
            await pollar.login({ provider: 'google' }); // Default to Google, can be extended
            if (pollar.walletAddress) {
              return {
                address: pollar.walletAddress,
              };
            }
            throw new Error('Failed to get wallet address from Pollar');
          } catch (error) {
            console.error('Error connecting to Pollar:', error);
            throw error;
          }
        },

        disconnect: async () => {
          try {
            await pollar.logout();
          } catch (error) {
            console.error('Error disconnecting from Pollar:', error);
            throw error;
          }
        },

        getAccount: async () => {
          try {
            if (pollar.walletAddress) {
              return { address: pollar.walletAddress };
            }
            throw new Error('No wallet address available');
          } catch (error) {
            console.error('Error getting account from Pollar:', error);
            throw error;
          }
        },

        isConnected: async () => {
          try {
            return pollar.isAuthenticated && !!pollar.walletAddress;
          } catch {
            return false;
          }
        },

        signTransaction: async (xdr: string) => {
          try {
            // Pollar doesn't expose a bare sign method
            // We'll return the XDR as-is, and the actual signing happens in signAndSubmitTx
            // This maintains the WalletProvider interface compatibility
            return { signedXdr: xdr };
          } catch (error) {
            console.error('Error signing transaction with Pollar:', error);
            throw error;
          }
        },

        signAndSubmitTx: async (xdr: string) => {
          try {
            // Pollar's signAndSubmitTx handles both signing and submission atomically
            await pollar.signAndSubmitTx(xdr);
            // Return a success response - Pollar modal handles the feedback
            // In production, you might want to monitor tx state via pollar.tx
            return { hash: 'pending' }; // Will be replaced with actual hash from Pollar tx state
          } catch (error) {
            console.error('Error submitting transaction with Pollar:', error);
            throw error;
          }
        },
      });
    }
  }, [pollar]);

  return <>{children}</>;
}
