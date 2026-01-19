import API from './axios';

/**
 * Wallet response from backend
 */
export interface Wallet {
  balance: number;
  updatedAt: string;
}

/**
 * GET /users/wallet
 * CREATOR only
 */
export const getCreatorWallet = async (): Promise<Wallet> => {
  const res = await API.get('/users/wallet');
  return res.data;
};
