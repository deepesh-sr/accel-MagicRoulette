import { LiteSVMProvider } from "anchor-litesvm";
import { beforeAll, describe, expect, test } from "bun:test";
import { LiteSVM } from "litesvm";
import { MagicRoulette } from "../target/types/magic_roulette";
import { Program } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { fundedSystemAccountInfo, getSetup } from "./setup";
import { BN } from "bn.js";
import { getTablePda } from "./pda";
import { fetchTableAcc } from "./accounts";

describe("magic-roulette", () => {
  let { litesvm, provider, program } = {} as {
    litesvm: LiteSVM;
    provider: LiteSVMProvider;
    program: Program<MagicRoulette>;
  };

  const [admin, player1, player2] = Array.from({ length: 3 }, () =>
    Keypair.generate()
  );

  const tablePda = getTablePda();

  beforeAll(async () => {
    ({ litesvm, provider, program } = await getSetup([
      ...[admin, player1, player2].map((kp) => {
        return {
          pubkey: kp.publicKey,
          account: fundedSystemAccountInfo(LAMPORTS_PER_SOL * 5),
        };
      }),
    ]));
  });

  test("initialize table", async () => {
    const minimumBetAmount = 1000; // 1000 lamports
    const roundPeriodTs = 60 * 5; // 5 minutes

    await program.methods
      .initializeTable(new BN(minimumBetAmount), new BN(roundPeriodTs))
      .accounts({
        admin: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    const tableAcc = await fetchTableAcc(program, tablePda);

    expect(tableAcc.admin).toStrictEqual(admin.publicKey);
    expect(tableAcc.minimumBetAmount.toNumber()).toBe(minimumBetAmount);
    expect(tableAcc.roundPeriodTs.toNumber()).toBe(roundPeriodTs);
  });

  test.skip("place bet as player1 and player2", async () => {
    // TODO
  });

  test.skip("spin the roulette", async () => {
    // TODO
  });

  test.skip("advance table round", async () => {
    // TODO
  });

  test.skip("claim winnings", async () => {
    // TODO: can only test if there's a player with winning bet from a round
  });
});
