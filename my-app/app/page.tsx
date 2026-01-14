'use client';

import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useChainId,
  useChains,
  useSwitchChain,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { avalancheFuji } from 'wagmi/chains';

// ==============================
// 🔹 CONFIG
// ==============================

// 👉 GANTI dengan contract address hasil deploy kamu day 2
const CONTRACT_ADDRESS = '0x6a328e29838b9c6e031916416b6f6b301d34246f';

// 👉 ABI SIMPLE STORAGE
const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];


const shortenAddress = (address?: string) => {
  if (!address) return '-';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function Page() {
  // ==============================
  // 🔹 WALLET STATE
  // ==============================
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

const chainId = useChainId();
const chains = useChains();
const { switchChain } = useSwitchChain();

const currentChain = chains.find(
  (chain) => chain.id === chainId
);


  // ==============================
  // 🔹 LOCAL STATE
  // ==============================
  const [inputValue, setInputValue] = useState('');

  // ==============================
  // 🔹 READ CONTRACT
  // ==============================
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  // ==============================
  // 🔹 WRITE CONTRACT
  // ==============================
  const {
    writeContract,
    isPending: isWriting,
  } = useWriteContract();

const handleSetValue = async () => {
  if (!inputValue) return;

  // ❗ pastikan wallet di Avalanche Fuji
  if (chainId !== avalancheFuji.id) {
    switchChain({ chainId: avalancheFuji.id });
    return;
  }

  writeContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'setValue',
    args: [BigInt(inputValue)],
  });
};


  // ==============================
  // 🔹 UI
  // ==============================
  return (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-900 text-white">
    <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-6 shadow-lg">

      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">
          Day 3 – Frontend dApp
        </h1>
        <p className="text-sm text-zinc-400">
          Avalanche Fuji Network
        </p>
      </div>

      {/* WALLET SECTION */}
      <div className="border border-zinc-800 rounded-lg p-4 space-y-3">
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full bg-white text-black py-2 rounded-md font-medium hover:bg-zinc-200 transition"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="space-y-2">
            <div>
              <p className="text-xs text-zinc-400">Address</p>
              <p
                className="font-mono text-sm"
                title={address}
              >
                {shortenAddress(address)}
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-400">Network</p>
              <p className="text-sm">
                {currentChain ? currentChain.name : 'Unknown'}
              </p>
            </div>

            <button
              onClick={() => disconnect()}
              className="text-xs text-red-400 underline pt-1"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* READ CONTRACT */}
      <div className="border border-zinc-800 rounded-lg p-4 space-y-2">
        <p className="text-xs text-zinc-400">Stored Value</p>

        <p className="text-3xl font-bold">
          {isReading ? '...' : value?.toString()}
        </p>

        <button
          onClick={() => refetch()}
          className="text-xs underline text-zinc-400 hover:text-white"
        >
          Refresh
        </button>
      </div>

      {/* WRITE CONTRACT */}
      <div className="border border-zinc-800 rounded-lg p-4 space-y-3">
        <p className="text-xs text-zinc-400">Update Value</p>

        <input
          type="number"
          placeholder="Enter new value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full rounded-md bg-black border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <button
          onClick={handleSetValue}
          disabled={isWriting}
          className="w-full bg-blue-600 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isWriting ? 'Transaction pending...' : 'Set Value'}
        </button>
      </div>

      {/* FOOTER */}
      <p className="text-[11px] text-zinc-500 text-center">
        Smart contract is the single source of truth
      </p>

    </div>
  </main>
);
}
