"use client";

import { wrappedFetch } from "@/lib/api";
import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { SettingsProvider } from "@/providers/SettingsProvider";
import { ProgramProvider } from "@/providers/ProgramProvider";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { TableProvider } from "@/providers/TableProvider";
import { BalanceProvider } from "@/providers/BalanceProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        suspense: false,
        revalidateOnFocus: false,
        fetcher: wrappedFetch,
      }}
    >
      <SettingsProvider>
        <SolanaProvider>
          <ProgramProvider>
            <BalanceProvider>
              <TableProvider>{children}</TableProvider>
            </BalanceProvider>
          </ProgramProvider>
        </SolanaProvider>
      </SettingsProvider>
    </SWRConfig>
  );
}
