"use client";

import { useConnection, useUnifiedWallet } from "@jup-ag/wallet-adapter";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface BalanceContextType {
  balance: number | null;
}

const BalanceContextType = createContext<BalanceContextType>(
  {} as BalanceContextType
);

export function useBalance() {
  return useContext(BalanceContextType);
}

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);
  const { publicKey } = useUnifiedWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!publicKey) return;

    const id = connection.onAccountChange(publicKey, (acc) => {
      setBalance(acc.lamports);
    });

    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [connection, publicKey]);

  return (
    <BalanceContextType.Provider value={{ balance }}>
      {children}
    </BalanceContextType.Provider>
  );
}
