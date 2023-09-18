import {
  Keypair,
  Transaction,
  SystemProgram,
  Connection,
  PublicKey,
} from "@solana/web3.js";

import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  getMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { acc1 } from "./share/wallet";

export const createSPLToken = async () => {
  // Create Connection
  const connection = new Connection("https://api.devnet.solana.com");

  // Create a mint account
  const SHEEPToken = Keypair.generate();
  console.log(`mint: ${SHEEPToken.publicKey.toBase58()}`);
  let tx = new Transaction();
  tx.add(
    // create account
    SystemProgram.createAccount({
      fromPubkey: acc1.publicKey,
      newAccountPubkey: SHEEPToken.publicKey,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    // init mint
    createInitializeMintInstruction(
      SHEEPToken.publicKey, // mint pubkey
      0, // decimals
      acc1.publicKey, // mint authority (an auth to mint token)
      null // freeze authority (we use null first, the auth can let you freeze user's token account)
    )
  );
  const txHash = await connection.sendTransaction(tx, [acc1, SHEEPToken]);

  console.log(`create token txhash: ${txHash}`);
  await connection.confirmTransaction(txHash, "finalized");

  // get mint info
  let mint = await getMint(connection, SHEEPToken.publicKey);
  console.log(mint);

  // create associated token account

  // Associated Token Address (ATA)
  // this way will derive your token address by your SOL address + mint address
  // and anytime you get the same result, if you pass the same SOL address and mint address
  // it make managing token account easy, because I can know all of your token address just by your SOL address

  let ata = await getAssociatedTokenAddress(
    SHEEPToken.publicKey, // mint
    acc1.publicKey, // owner
    false // allow owner off curve
  );

  console.log(`ata: ${ata.toBase58()}`);

  let tx2 = new Transaction();
  tx2.add(
    createAssociatedTokenAccountInstruction(
      acc1.publicKey, // payer
      ata, // ata
      acc1.publicKey, // owner
      SHEEPToken.publicKey // mint
    )
  );
  const txHash2 = await connection.sendTransaction(tx2, [acc1]);

  console.log(`create ata txhash: ${txHash2}`);
  await connection.confirmTransaction(txHash2, "finalized");

  //Mint token to ATA
  let tx3 = new Transaction();
  tx3.add(
    createMintToCheckedInstruction(
      SHEEPToken.publicKey, // mint
      ata, // destination
      acc1.publicKey, // mint auth
      1000, // amount
      0 // decimals
    )
  );

  console.log(
    `mint token txhash: ${await connection.sendTransaction(tx3, [acc1])}`
  );
};
