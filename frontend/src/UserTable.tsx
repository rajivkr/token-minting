import { MintedTxnEntity } from './constants';

const UserTable = ({
  mintedTransactions,
}: {
  mintedTransactions: Array<MintedTxnEntity>;
}) => {
  return (
    <>
      {mintedTransactions.length > 0 ? (
        <>
          <div className="text-center text-green-700 text-2xl font-bold py-4">
            Transactions Minted by Wallet
          </div>
          <div className="flex flex-col mx-8">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium border-emerald-300 bg-emerald-300">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          #
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Receiver Address
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Transaction Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mintedTransactions.length > 0 &&
                        mintedTransactions.map((txnObj, index) => {
                          return (
                            <tr
                              className={
                                index % 2 === 0
                                  ? 'border-b border-gray-200 bg-gray-200'
                                  : 'border-b border-stone-300 bg-stone-300'
                              }
                              key={txnObj.txn_hash}
                            >
                              <td className="whitespace-nowrap px-6 py-4 font-medium">
                                {index + 1}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {txnObj.receiver_address}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {txnObj.amount}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <a
                                  href={`https://goerli.etherscan.io/tx/${txnObj.txn_hash}`}
                                  className="text-info transition duration-150 ease-in-out hover:text-info-600 focus:text-info-600 active:text-info-700"
                                  target="_blank"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                                    />
                                  </svg>
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-green-700 text-2xl font-bold py-4">
          No Transactions Minted by Wallet
        </div>
      )}
    </>
  );
};

export default UserTable;
