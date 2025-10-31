import { PublicKey } from "@solana/web3.js";
import idl from "../target/idl/magic_roulette.json";

export const MAGIC_ROULETTE_PROGRAM_ID = new PublicKey(idl.address);
