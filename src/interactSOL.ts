import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";

export const interactSOL = async () => {
  // Create Connection
  const connection = new Connection("https://api.devnet.solana.com");

  // Create Keypair from SecretKey
  const acc1 = Keypair.fromSecretKey(
    bs58.decode(
      "3evCMJshqND69vFWDG9RPouWUFED3xb6GEtLLd1bafERdt1ET5ramtyNS1Pp1WryJoi3mR466jjaPqh4nezbVFNj"
    )
  );
  const acc2 = Keypair.fromSecretKey(
    bs58.decode(
      "gQ9NJuGt5c533w4Khj5s8weCXbGEgtDpFqxE7q9xfouAwUcKoQ1nVCGAsb8J9aEJNhLGvLLrNxtjmWhtsiBfpqk"
    )
  );

  // Request Airdrop
  (async () => {
    let txhash = await connection.requestAirdrop(acc1.publicKey, 1e9);
    console.log(`txhash: ${txhash}`);
  })();

  // Get Balance
  (async () => {
    let balance = await connection.getBalance(acc1.publicKey);
    console.log(`SOL Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  })();

  // Transfer SOL
  (async () => {
    let tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: acc1.publicKey,
        toPubkey: acc2.publicKey,
        lamports: 0.1 * LAMPORTS_PER_SOL,
      })
    );
    tx.feePayer = acc1.publicKey;
    let txhash = await connection.sendTransaction(tx, [acc1]);
    console.log(`txhash: ${txhash}`);
  })();
};
