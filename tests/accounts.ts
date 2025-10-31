import { Program } from "@coral-xyz/anchor";
import { MagicRoulette } from "../target/types/magic_roulette";
import { PublicKey } from "@solana/web3.js";

export async function fetchBetAcc(
  program: Program<MagicRoulette>,
  betPda: PublicKey
) {
  return await program.account.bet.fetchNullable(betPda);
}

export async function fetchRoundAcc(
  program: Program<MagicRoulette>,
  roundPda: PublicKey
) {
  return await program.account.round.fetchNullable(roundPda);
}

export async function fetchTableAcc(
  program: Program<MagicRoulette>,
  tablePda: PublicKey
) {
  return await program.account.table.fetchNullable(tablePda);
}
