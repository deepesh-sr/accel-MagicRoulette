"use client";

import { BetsProvider } from "@/providers/BetsProvider";
import { useUnifiedWallet } from "@jup-ag/wallet-adapter";
import { RoundInfo } from "@/components/RoundInfo";
import { RouletteTable } from "@/components/RouletteTable";
import { PlaceBetSection } from "@/components/PlaceBetSection";
import { BetHistory } from "@/components/BetHistory";
import { RoundsProvider } from "@/providers/RoundsProvider";

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

  // only load all bets when wallet is connected
  return publicKey ? (
    <BetsProvider player={publicKey.toBase58()}>
      <RoundsProvider>
        <Main />
      </RoundsProvider>
    </BetsProvider>
  ) : (
    <RoundsProvider>
      <Main />
    </RoundsProvider>
  );
}
