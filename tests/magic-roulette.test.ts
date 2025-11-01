import { LiteSVMProvider } from "anchor-litesvm";
import { beforeAll, describe, expect, test } from "bun:test";
import { LiteSVM } from "litesvm";
import { MagicRoulette } from "../target/types/magic_roulette";
import { Program } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { fundedSystemAccountInfo, getSetup } from "./setup";
import { BN } from "bn.js";
import { getRoundPda, getTablePda } from "./pda";
import { fetchRoundAcc, fetchTableAcc } from "./accounts";

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

  test("place bet as player1 and player2", async () => {
    // TODO
    let betAmount1 = new BN(10000);
    const bet_type_1 = { straightUp: {} };
    let roundNumber = new BN(1);

    const roundPDA = getRoundPda(roundNumber);

    await program.methods
      .placeBet(betAmount1, bet_type_1)
      .accounts({
        player: player1.publicKey,
        round: roundPDA,
      })
      .signers([player1])
      .rpc();

    let betAmount2 = new BN(10000);
    const bet_type_2 = { red: {} };

    await program.methods
      .placeBet(betAmount2, bet_type_2)
      .accounts({
        player: player2.publicKey,
        round: roundPDA,
      })
      .signers([player2])
      .rpc();

    const roundAccount = await fetchRoundAcc(program, roundPDA);

    expect(roundAccount.poolAmount.toNumber()).toBe(
      betAmount1.toNumber() + betAmount2.toNumber()
    );
    expect(roundAccount.isClaimed).toBe(false);
    expect(roundAccount.isSpun).toBe(false);
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
