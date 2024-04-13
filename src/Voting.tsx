import { useState } from 'react';
import { ethereumProvider, intmaxDappClient } from "intmax-walletsdk/dapp";

const DEFAULT_WALLET_URL = "https://wallet.intmax.io";
const DEFAULT_DAPP_ICON = `${window.location.origin}/vite.svg` as string;
const DAPP_METADATA = {
  name: "INTMAX Dapp Example",
  description: "This is a simple example of how to use the sdk dapp client.",
  icons: [DEFAULT_DAPP_ICON],
};

const createsdk = (walletUrl: string) => {
  return intmaxDappClient({
    wallet: { url: walletUrl, name: "INTMAX Wallet", window: { mode: "popup" } },
    metadata: DAPP_METADATA,
    providers: { eip155: ethereumProvider() },
  });
};

const sdk = createsdk(DEFAULT_WALLET_URL);

const Voting = () => {
  const [selectedClub, setSelectedClub] = useState('');
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({ ClubA: 0, ClubB: 0, ClubC: 0 });
  const [accounts, setAccounts] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");
  const [votedAddresses, setVotedAddresses] = useState<string[]>([]);

  const handleConnect = async () => {
    const ethereum = sdk.provider("eip155");
    await ethereum.request({ method: "eth_requestAccounts", params: [] });
    const accounts = (await ethereum.request({ method: "eth_accounts", params: [] })) as string[];
    setAccounts(accounts);
  };

  const handleSignMessage = async (club: string) => {
    if (accounts.length === 0) await handleConnect();
    const ethereum = sdk.provider("eip155");
    const _accounts = (await ethereum.request({ method: "eth_accounts", params: [] })) as string[];
    const currentAccount = _accounts[0];

     if (votedAddresses.includes(currentAccount)) {
        alert("You have already voted.");
        return;
     }

    const result = await ethereum.request({ method: "eth_sign", params: [currentAccount, "Vote " + club] });

    setResult(result as string);
    setVoteCounts(prev => ({ ...prev, [club]: (prev[club] || 0) + 1 }));
     setVotedAddresses(prev => [...prev, currentAccount]);

  };

  console.log(selectedClub + result)

  const truncateAddress = (address: string) => {
    return address.length > 8 ? `${address.substring(0, 8)}...` : address;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white">Sports Voting </h1>
        <button
          onClick={handleConnect}
          className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded"
        >
          {accounts.length > 0 ? `Connected: ${truncateAddress(accounts[0])}` : 'Connect Wallet'}
        </button>
      </div>

      <div className='flex flex-col justify-center items-center mb-[60px] mt-[100px]'>
        <h1 className="text-4xl font-bold mb-8 px-1">Vote for Your Favorite Club</h1>

        <div className="flex flex-col space-y-1 sm:flex-row sm:space-x-4">
          {['Club A', 'Club B', 'Club C'].map(club => (
            <div
              key={club}
              className={`relative p-4 w-[200px] h-[200px] hover:border-blue-500 group`}
              onClick={() => {
                setSelectedClub(club);
                handleSignMessage(club);
              }}
            >
              <img
                src={`/${club.replace(' ', '')}.png`}
                alt={club}
                className="absolute inset-0 w-full h-full object-cover bg-black"
              />
              <div
                className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                <p className="text-white text-center ">Vote for {club}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-0 sm:flex-row sm:space-x-4 mt-8">
          {['Club A', 'Club B', 'Club C'].map(club => (
            <div key={club}>
              <p className="text-center">{club} Votes: {voteCounts[club]}</p>
            </div>
          ))}
        </div>

        <div className='flex flex-col justify-center items-center mt-[70px]'>
          <h1 className="text-4xl font-bold mb-4">How to Vote</h1>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Steps to Connect and Vote:</h2>
            <ol className="list-decimal list-inside">
              <li className="mb-2">Click on the "Connect Wallet" button.</li>
              <li className="mb-2">Login to your INTMAX Wallet.</li>
              <li className="mb-2">Connect your wallet to the DApp.</li>
              <li className="mb-2">Choose your favorite club from the options.</li>
              <li className="mb-2">Click on the club to cast your vote.</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Voting;