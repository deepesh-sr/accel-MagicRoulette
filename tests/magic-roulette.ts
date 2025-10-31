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
      [Buffer.from("vault")],
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

  it("Player place the bet", async () => {
    let player1 = anchor.web3.Keypair.generate();
    let player2 = anchor.web3.Keypair.generate();
    let player3 = anchor.web3.Keypair.generate();

    let players = [player1, player2, player3];

    for (let i = 0; i < players.length; i++) {
      const signature = await provider.connection.requestAirdrop(
        players[i].publicKey,
        anchor.web3.LAMPORTS_PER_SOL * 3
      );
      await provider.connection.confirmTransaction(signature, "confirmed");
      let balance = await provider.connection.getBalance(players[i].publicKey);
      console.log(`Player ${players[i].publicKey} balance : ${balance}`);
    }

    const [tablePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("table")],
      program.programId
    );

    const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    );
    // round
    const [roundPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("round")],
      program.programId
    );

    const [player1BetPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), player1.publicKey.toBytes(), roundPDA.toBytes()],
      program.programId
    );
    const [player2BetPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), player2.publicKey.toBytes(), roundPDA.toBytes()],
      program.programId
    );
    const [player3BetPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), player3.publicKey.toBytes(), roundPDA.toBytes()],
      program.programId
    );

    //player 1 place the bet
    const bet_amount_1 = new anchor.BN(100000);
    const bet_type_1 = { straightUp: {} };

    const tx_1 = await program.methods
      .placeBet(bet_amount_1, bet_type_1)
      .accountsStrict({
        player: player1.publicKey,
        round: roundPDA,
        bet: player1BetPDA,
        table: tablePDA,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([player1])
      .rpc();

    //player 1 place the bet
    const bet_amount_2 = new anchor.BN(300000);
    const bet_type_2 = { black: {} };

    const tx_2 = await program.methods
      .placeBet(bet_amount_2, bet_type_2)
      .accountsStrict({
        player: player2.publicKey,
        round: roundPDA,
        bet: player2BetPDA,
        table: tablePDA,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([player2])
      .rpc();

    //player 1 place the bet
    const bet_amount_3 = new anchor.BN(200000);
    const bet_type_3 = { red: {} };

    const tx_3 = await program.methods
      .placeBet(bet_amount_3, bet_type_3)
      .accountsStrict({
        player: player3.publicKey,
        round: roundPDA,
        bet: player3BetPDA,
        table: tablePDA,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([player3])
      .rpc();

    const player1BetAccount = await program.account.bet.fetch(player1BetPDA);
    console.log("Player 1 Bet Account ", player1BetAccount);

    const player2BetAccount = await program.account.bet.fetch(player2BetPDA);
    console.log("Player 2 Bet Account ", player2BetAccount);

    const player3BetAccount = await program.account.bet.fetch(player3BetPDA);
    console.log("Player 3 Bet Account ", player3BetAccount);

    let valtBalance = await provider.connection.getBalance(vaultPDA);
    console.log("VAULT BALANCE ", valtBalance);

    const roundAccount = await program.account.round.fetch(roundPDA);
    console.log("ROUND ACCOUNT \n", roundAccount);
    console.log("ROUND POOL PRIZE \n", roundAccount.poolAmount.toString());
  });
});
