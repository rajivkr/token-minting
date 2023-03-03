import { utils } from 'ethers';
import { TokenState, UserState, ZeroBigNum } from './constants';

const TokenInfo = ({
  tokenState,
  walletConnected,
}: {
  walletConnected: boolean;
  tokenState: TokenState;
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex">
        <div className="custom-label">Token Name </div>
        <div className="custom-value">
          <span className="text-white px-4"> - </span>
          {tokenState.tokenName}
        </div>
      </div>
      <div className="flex">
        <div className="custom-label"> Token Symbol</div>
        <div className="custom-value">
          <span className="text-white px-4"> - </span> {tokenState.tokenSymbol}
        </div>
      </div>
      <div className="flex">
        <div className="custom-label">Token Balance</div>
        <div>
          {tokenState.balance.lte(ZeroBigNum) ? (
            <div className="custom-value flex text-white">
              <span className="px-4"> - </span>
              {walletConnected ? 0 : ''}
            </div>
          ) : (
            <div className="custom-value flex text-white">
              <span className=" px-4"> - </span>
              {utils.formatEther(tokenState.balance)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
