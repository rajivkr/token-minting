import { useEffect, useRef, useState } from 'react';
import './Home.css';
import Web3Modal from 'web3modal';
import {
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
  MintedTxnEntity,
  ZeroBigNum,
  UserState,
  TokenState,
  PageOptionsState,
} from './constants';
import {
  saveUserLoginToDb,
  getMintedTxnsFromDb,
  updateBalanceToDb,
  populateMintToDb,
} from './db-helpers';
import { BigNumber, Contract, providers, utils } from 'ethers';
import PageHeader from './Header';
import TokenInfo from './TokenInfo';
import UserTable from './UserTable';
import Toast from './Toast';
import UserInput from './UserInput';
import { encode as base64_encode } from 'base-64';

function Home() {
  // For default state of Bignumber.
  const initialMintedArr: Array<MintedTxnEntity> = [];

  // For showing the loading spinner and alerts.
  const pageOptionObj = useState({
    showAlert: false,
    text: '',
    loading: false,
  } as PageOptionsState);
  const [pageOptions, setPageOptions] = pageOptionObj;

  // For storing the token information.
  const [tokenState, setTokenState] = useState({
    balance: ZeroBigNum,
    tokenName: '',
    tokenSymbol: '',
  } as TokenState);

  // For storing the connected user information.
  const userOptionObj = useState({
    tokensToMint: ZeroBigNum,
    receiverAddress: ``,
    walletConnected: false,
    walletAddress: ``,
    mintedTransactions: initialMintedArr,
  } as UserState);
  const [userState, setUserState] = userOptionObj;

  // Create a reference to the Web3 Modal (used for connecting to Metamask)
  const web3ModalRef = useRef<Web3Modal>();

  /**
   *
   * @returns a Provider or Signer or Both - representing the Ethereum RPC with or without the signing capabilities of metamask attached.
   */
  const getProviderSigner = async (config: {
    needSigner?: boolean;
    needBoth?: boolean;
  }): Promise<
    | providers.JsonRpcSigner
    | providers.Web3Provider
    | [providers.JsonRpcSigner, providers.Web3Provider]
  > => {
    const provider = await web3ModalRef.current?.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and ask them to switch.
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      setPageOptions((prevState) => ({
        ...prevState,
        showAlert: true,
        text: `Please switch your network to Goerli.`,
      }));
      throw new Error('Change network to Goerli');
    }
    let signer: providers.JsonRpcSigner;
    if (config.needSigner || config.needBoth) {
      signer = web3Provider.getSigner();
    }

    return config.needBoth
      ? [signer!, web3Provider]
      : config.needSigner
      ? signer!
      : web3Provider;
  };

  /**
   * sets the wallet address of connected account in userState.
   */
  const setWalletAddress = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const signer = (await getProviderSigner({
        needSigner: true,
      })) as providers.JsonRpcSigner;
      const walletAddress = await signer.getAddress();
      setUserState((prevState) => ({
        ...prevState,
        walletConnected: true,
        walletAddress,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * checks the balance of Token held by an address.
   */
  const getBalanceOfTokens = async () => {
    try {
      // Get both Provider & Signer instances.
      const [signer, provider] = (await getProviderSigner({
        needBoth: true,
      })) as [providers.JsonRpcSigner, providers.Web3Provider];
      // Create an instance of tokenContract
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider,
      );
      const wallet_address = await signer.getAddress();
      const balance = await tokenContract.balanceOf(wallet_address);
      const tokenName = await tokenContract.name();
      const tokenSymbol = await tokenContract.symbol();
      setTokenState({
        balance,
        tokenName,
        tokenSymbol,
      });
      const bearerToken = base64_encode(
        `${wallet_address}:${tokenName}:${tokenSymbol}:${balance.toString()}`,
      );
      await saveUserLoginToDb(bearerToken);
      const mintedTransactions = await getMintedTxnsFromDb();
      setUserState((prevState) => ({
        ...prevState,
        mintedTransactions,
      }));
    } catch (err) {
      console.error(err);
      setTokenState((prevState) => ({ ...prevState, balance: ZeroBigNum }));
    }
  };

  /**
   *
   * @param address receiver address.
   * @param amount amount to mint to the receiver.
   *
   * mints given `amount` number of tokens to given `address`.
   */
  const mintTokens = async (address: string, amount: BigNumber) => {
    try {
      const signer = (await getProviderSigner({
        needSigner: true,
      })) as providers.JsonRpcSigner;
      // Create an instance of tokenContract
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer,
      );
      const tx = await tokenContract.mint(
        address,
        utils.parseEther(amount.toString()),
      );
      setPageOptions((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const txn = await tx.wait();
      setPageOptions({
        showAlert: true,
        text: `Token successfully minted to given address.`,
        loading: false,
      });
      await getBalanceOfTokens();
      setUserState((prevState) => ({
        ...prevState,
        tokensToMint: ZeroBigNum,
        receiverAddress: '',
      }));
      updateBalanceToDb({
        wallet_address: userState.walletAddress,
        token_name: tokenState.tokenName,
        token_symbol: tokenState.tokenSymbol,
        balance: tokenState.balance,
      });
      const mintedTransactions = await populateMintToDb({
        receiver_address: address,
        amount: amount,
        txn_hash: txn.transactionHash,
      });
      setUserState((prevState) => ({
        ...prevState,
        mintedTransactions,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * used to connect to the metamask wallet.
   */
  const connectWallet = async () => {
    try {
      await setWalletAddress();
      setPageOptions((prevState) => ({
        ...prevState,
        loading: true,
      }));
      // Get user balance for given token.
      await getBalanceOfTokens();
      setPageOptions((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      setUserState((prevState) => ({
        ...prevState,
        walletAddress: ``,
        walletConnected: false,
      }));
    }
  };

  useEffect(() => {
    if (!userState.walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'goerli',
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [userState.walletConnected]);

  // Spinner when we are fetching data or processing the minting action.
  if (pageOptions.loading) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white">
        <div
          className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px text-white !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader userState={userState} connectWallet={connectWallet} />
      <TokenInfo
        tokenState={tokenState}
        walletConnected={userState.walletConnected}
      />
      <UserInput userOptionObj={userOptionObj} mintTokens={mintTokens} />
      <UserTable mintedTransactions={userState.mintedTransactions} />
      <Toast pageOptionState={pageOptionObj} />
    </div>
  );
}

export default Home;
