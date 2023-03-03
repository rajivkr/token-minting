import { BigNumber } from 'ethers';
import React from 'react';
import { UserState, ZeroBigNum } from './constants';

const UserInput = ({
  mintTokens,
  userOptionObj,
}: {
  mintTokens: (address: string, amount: BigNumber) => Promise<void>;
  userOptionObj: [UserState, React.Dispatch<React.SetStateAction<UserState>>];
}) => {
  const [userState, setUserState] = userOptionObj;

  return (
    <>
      <div className="text-center text-green-700 mt-8">
        Please enter both fields to continue.
      </div>
      <div className="flex w-full items-center mb-4">
        <div className="w-1/2 flex flex-col items-center mr-8">
          <label className="text-green-700">Enter User Address to Mint</label>
          <input
            type="text"
            placeholder="User Address to Mint"
            onChange={(e) => {
              if (e.target.value)
                setUserState((prevState) => ({
                  ...prevState,
                  receiverAddress: e.target.value,
                }));
              else
                setUserState((prevState) => ({
                  ...prevState,
                  receiverAddress: '',
                }));
            }}
            className="custom-input"
          />
        </div>
        <div className="w-1/2 flex flex-col items-center">
          <label className="text-green-700">Enter No. of Tokens to Mint</label>
          <input
            type="text"
            placeholder="Token to Mint"
            onChange={(e) => {
              if (e.target.value)
                setUserState((prevState) => ({
                  ...prevState,
                  tokensToMint: BigNumber.from(~~Number(e.target.value)),
                }));
              else
                setUserState((prevState) => ({
                  ...prevState,
                  tokensToMint: ZeroBigNum,
                }));
            }}
            className="custom-input"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow mx-8"
          disabled={
            userState.tokensToMint.lte(ZeroBigNum) ||
            userState.receiverAddress === ''
          }
          onClick={() =>
            mintTokens(userState.receiverAddress, userState.tokensToMint)
          }
          style={{
            background:
              userState.tokensToMint.lte(ZeroBigNum) ||
              userState.receiverAddress === ''
                ? 'grey'
                : 'white',
            cursor:
              userState.tokensToMint.lte(ZeroBigNum) ||
              userState.receiverAddress === ''
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          {!(
            userState.tokensToMint.lte(ZeroBigNum) ||
            userState.receiverAddress === ''
          ) && (
            <div className="absolute inset-0 w-3 bg-green-700 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          )}
          <span className="relative text-black group-hover:text-white">
            Mint Token
          </span>
        </button>
      </div>
    </>
  );
};

export default UserInput;
