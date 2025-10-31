import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { MAGIC_ROULETTE_PROGRAM_ID } from "./constants";

export function getBetPda(player: PublicKey, round: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("bet"), player.toBuffer(), round.toBuffer()],
    MAGIC_ROULETTE_PROGRAM_ID
  )[0];
}

export function getTablePda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("table")],
    MAGIC_ROULETTE_PROGRAM_ID
  )[0];
}

export function getVaultPda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault")],
    MAGIC_ROULETTE_PROGRAM_ID
  )[0];
}

export function getRoundPda(roundNumber: BN) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("round"), roundNumber.toArrayLike(Buffer, "le", 8)],
    MAGIC_ROULETTE_PROGRAM_ID
  )[0];
}
