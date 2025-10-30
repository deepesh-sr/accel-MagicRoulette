import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MagicRoulette } from "../target/types/magic_roulette";

describe("magic-roulette", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  let wallet = provider.wallet;

  const program = anchor.workspace.magicRoulette as Program<MagicRoulette>;

  let admin = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    //airdrop to admin
    const signature = await provider.connection.requestAirdrop(
      admin.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature, "confirmed");
    let balance = await provider.connection.getBalance(admin.publicKey);
    console.log(`Admin balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);

    const [roundPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("round")],
      program.programId
    );

    const [tablePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("table")],
      program.programId
    );

    const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), admin.publicKey.toBytes()],
      program.programId
    );

    const tx = await program.methods
      .initializeTable()
      .accountsStrict({
        admin: admin.publicKey,
        round: roundPDA,
        table: tablePDA,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    const table_account = await program.account.table.fetch(tablePDA);
    console.log("TABLE ACCOUNT", table_account);

    const roundAccount = await program.account.round.fetch(roundPDA);

    console.log("ROUND ACCOUNT \n", roundAccount);

    let valtBalance = await provider.connection.getBalance(vaultPDA);
    console.log("VAULT BALANCE ", valtBalance);
  });
});
