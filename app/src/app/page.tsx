"use client";

import { BetsProvider } from "@/providers/BetsProvider";
import { useTable } from "@/providers/TableProvider";
import { useUnifiedWallet } from "@jup-ag/wallet-adapter";
import { Spinner } from "@/components/ui/spinner";
import { RoundInfo } from "@/components/RoundInfo";
import { RouletteTable } from "@/components/RouletteTable";
import { PlaceBetSection } from "@/components/PlaceBetSection";
import { BetHistory } from "@/components/BetHistory";

function Main() {
  return (
    <section className="flex flex-col gap-8 py-4 w-fit items-center">
      <section className="flex xl:flex-row flex-col gap-8 items-start">
        <RouletteTable />
        <section className="flex flex-col xl:flex-col lg:flex-row gap-4 xl:justify-between w-full">
          <RoundInfo />
          <PlaceBetSection />
        </section>
      </section>
      <BetHistory />
    </section>
  );
}

export default function Page() {
  const { publicKey } = useUnifiedWallet();
  const { tableData, tableLoading } = useTable();

  if (tableLoading) {
    return (
      <section className="flex flex-col justify-center items-center gap-4 flex-1">
        <Spinner className="size-10 text-accent" />
        <p className="font-semibold text-accent">Loading...</p>
      </section>
    );
  }

  // only load all bets when wallet is connected
  return publicKey ? (
    <BetsProvider player={publicKey.toBase58()}>
      <Main />
    </BetsProvider>
  ) : (
    tableData && <Main />
  );
}
