import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// Create Keypair from SecretKey

export const acc1 = Keypair.fromSecretKey(
  bs58.decode(
    "3evCMJshqND69vFWDG9RPouWUFED3xb6GEtLLd1bafERdt1ET5ramtyNS1Pp1WryJoi3mR466jjaPqh4nezbVFNj"
  )
);

export const acc2 = Keypair.fromSecretKey(
  bs58.decode(
    "gQ9NJuGt5c533w4Khj5s8weCXbGEgtDpFqxE7q9xfouAwUcKoQ1nVCGAsb8J9aEJNhLGvLLrNxtjmWhtsiBfpqk"
  )
);

export const SHEEPTokenPK = "4QstsCbBaggd5kEiHSrd6P5mFgxs2sN444RUG1MW3bUa";

export const acc1SHEEPTokenATA = "7K3LcB1zmnECWQ1fBLvmGsh8XC84uRroBqqsQkdTK43X";
