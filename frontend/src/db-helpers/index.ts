import { BigNumber } from 'ethers';
import { LedgerEntity, MintedTxnEntity } from './../constants/index';

/**
 * populates the latest user balances in backend.
 */
export const updateBalanceToDb = async (params: {
  wallet_address: string;
  token_name: string;
  token_symbol: string;
  balance: BigNumber;
}) => {
  const accessToken = localStorage.getItem('access-token');
  if (accessToken) {
    await fetch(`/api/v1/user/balance`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        token_name: params.token_name,
        token_symbol: params.token_symbol,
        balance: params.balance.toString(),
      }),
    });
  }
};

/**
 * populates the user signup and login in backend.
 */
export const saveUserLoginToDb = async (bearerToken: string) => {
  await fetch(`/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('access-token', data.access_token);
    });
};

/**
 * populates the list of transactions from the database.
 */
export const getMintedTxnsFromDb = async (): Promise<MintedTxnEntity[]> => {
  const accessToken = localStorage.getItem('access-token');
  let result: Array<MintedTxnEntity> = [];
  if (accessToken) {
    const data: LedgerEntity[] = await fetch(`/api/v1/mint`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((response) => response.json());
    return data.map(
      (dbObj) =>
        ({
          sender_address: dbObj.user.address,
          receiver_address: dbObj.receiver_address,
          amount: dbObj.amount,
          txn_hash: dbObj.txn_hash,
        } as MintedTxnEntity),
    );
  } else return [];
};

/**
 * populate minted transcation into the database.
 */
export const populateMintToDb = async (params: {
  receiver_address: string;
  amount: BigNumber;
  txn_hash: string;
}): Promise<MintedTxnEntity[]> => {
  const accessToken = localStorage.getItem('access-token');
  if (accessToken) {
    const data: LedgerEntity[] = await fetch(`/api/v1/mint`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        amount: params.amount.toString(),
        receiver_address: params.receiver_address,
        txn_hash: params.txn_hash,
      }),
    }).then((response) => response.json());
    return data.map(
      (dbObj) =>
        ({
          sender_address: dbObj.user.address,
          receiver_address: dbObj.receiver_address,
          amount: dbObj.amount,
          txn_hash: dbObj.txn_hash,
        } as MintedTxnEntity),
    );
  } else return [];
};
