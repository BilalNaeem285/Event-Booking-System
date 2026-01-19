// import React, { useEffect, useState } from 'react';
// import { getCreatorWallet } from '../../api/users.api';

// interface Wallet {
//   balance: number | string;
//   updatedAt: string;
// }

// const Wallet: React.FC = () => {
//   const [wallet, setWallet] = useState<Wallet | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchWallet = async () => {
//       try {
//         const data = await getCreatorWallet();
//         setWallet(data);
//       } catch (err) {
//         setError('Failed to load wallet');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWallet();
//   }, []);

//   if (loading) return <p>Loading wallet...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error}</p>;
//   if (!wallet) return <p>No wallet found</p>;

//   // ✅ SAFE conversion
//   const balanceNumber = Number(wallet.balance);

//   return (
//     <div style={{ maxWidth: 400, margin: '0 auto' }}>
//       <h2>Creator Wallet</h2>

//       <p>
//         <strong>Balance:</strong>{' '}
//         ${isNaN(balanceNumber) ? '0.00' : balanceNumber.toFixed(2)}
//       </p>

//       <p>
//         <strong>Last Updated:</strong>{' '}
//         {new Date(wallet.updatedAt).toLocaleString()}
//       </p>
//     </div>
//   );
// };

// export default Wallet;






import React, { useEffect, useState } from 'react';
import { getCreatorWallet } from '../../api/users.api';

const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    getCreatorWallet()
      .then((data) => {
        setWallet(data);
      })
      .catch((err) => {
        // If the server says 404 (Not Found), we don't crash, we just store the error
        if (err.response?.status === 404) {
          setErrorStatus(404);
        }
        console.error("Wallet error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-zinc-500 animate-pulse font-black tracking-[0.3em] text-xs">
      ACCESSING SECURE VAULT...
    </div>
  );

  // Determine the balance: 
  // If wallet exists, use its balance. If we got a 404, use 0. Otherwise 0.
  const displayBalance = wallet?.balance ?? 0;
  const lastUpdated = wallet?.updatedAt ? new Date(wallet.updatedAt).toLocaleDateString() : "Never";

  return (
    <div className="max-w-md mx-auto py-24 px-6">
      <div className="relative glass p-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
        {/* Vibrant Background Glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-center">
            Creator Revenue
          </p>
          
          <div className="text-center mb-16">
            <span className="text-7xl font-black tracking-tighter text-white">
              ${Number(displayBalance).toLocaleString()}
            </span>
            {errorStatus === 404 && (
              <p className="text-[10px] text-zinc-600 mt-4 uppercase font-bold tracking-widest">
                Wallet Initialized (New Account)
              </p>
            )}
          </div>

          <div className="space-y-4">
            <button className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl">
              Withdraw Funds
            </button>
            <div className="text-center">
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;