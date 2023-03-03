import { UserState } from './constants';

const PageHeader = ({
  userState,
  connectWallet,
}: {
  userState: UserState;
  connectWallet: () => {};
}) => {
  return (
    <header className="h-20 min-w-full flex justify-end shadow-2xl py-4">
      {userState.walletConnected ? (
        <>
          <div className="mx-8 text-lg text-white">
            <span className="text-green-700 underline">Connected Address</span>
            <span className="px-2">:</span>
            <span className="truncate">{userState.walletAddress}</span>
          </div>
        </>
      ) : (
        <button
          className="group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow mx-8"
          onClick={connectWallet}
        >
          <div className="absolute inset-0 w-3 bg-green-700 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <span className="relative text-black group-hover:text-white">
            Connect your wallet
          </span>
        </button>
      )}
    </header>
  );
};

export default PageHeader;
