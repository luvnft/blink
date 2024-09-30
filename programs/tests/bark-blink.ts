import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BarkBlinks } from "../target/types/bark_blinks";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";
import { assert } from "chai";

describe("bark-blinks", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BarkBlinks as Program<BarkBlinks>;
  const wallet = provider.wallet as anchor.Wallet;

  let blinkMint: PublicKey;
  let blinkTokenAccount: PublicKey;
  let blinkPDA: PublicKey;

  before(async () => {
    // Create a new mint for testing
    blinkMint = await createMint(
      provider.connection,
      wallet.payer,
      wallet.publicKey,
      null,
      9
    );

    // Create a token account for the wallet
    blinkTokenAccount = await createAccount(
      provider.connection,
      wallet.payer,
      blinkMint,
      wallet.publicKey
    );

    // Mint some tokens to the wallet's token account
    await mintTo(
      provider.connection,
      wallet.payer,
      blinkMint,
      blinkTokenAccount,
      wallet.payer,
      1000 * LAMPORTS_PER_SOL
    );

    // Derive the blink PDA
    [blinkPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("blink"), blinkMint.toBuffer()],
      program.programId
    );
  });

  it("Creates a blink", async () => {
    const name = "Test Blink";
    const description = "This is a test blink";
    const blinkType = { standard: {} };
    const imageUrl = "https://example.com/image.png";

    await program.methods
      .createBlink(name, description, blinkType, imageUrl)
      .accounts({
        blink: blinkPDA,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const blinkAccount = await program.account.blink.fetch(blinkPDA);
    assert.equal(blinkAccount.owner.toBase58(), wallet.publicKey.toBase58());
    assert.equal(blinkAccount.name, name);
    assert.equal(blinkAccount.description, description);
    assert.deepEqual(blinkAccount.blinkType, blinkType);
    assert.equal(blinkAccount.imageUrl, imageUrl);
  });

  it("Updates a blink", async () => {
    const newName = "Updated Blink";
    const newDescription = "This is an updated blink";
    const newImageUrl = "https://example.com/new-image.png";

    await program.methods
      .updateBlink(newName, newDescription, newImageUrl)
      .accounts({
        blink: blinkPDA,
        owner: wallet.publicKey,
      })
      .rpc();

    const updatedBlinkAccount = await program.account.blink.fetch(blinkPDA);
    assert.equal(updatedBlinkAccount.name, newName);
    assert.equal(updatedBlinkAccount.description, newDescription);
    assert.equal(updatedBlinkAccount.imageUrl, newImageUrl);
  });

  it("Creates an NFT", async () => {
    const nftKeypair = Keypair.generate();
    const name = "Test NFT";
    const symbol = "TNFT";
    const uri = "https://example.com/nft-metadata.json";

    await program.methods
      .createNft(name, symbol, uri)
      .accounts({
        nft: nftKeypair.publicKey,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadata: await getMetadataAddress(nftKeypair.publicKey),
        mint: nftKeypair.publicKey,
        tokenAccount: await getAssociatedTokenAddress(nftKeypair.publicKey, wallet.publicKey),
        metadataProgram: METADATA_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([nftKeypair])
      .rpc();

    const nftAccount = await program.account.nft.fetch(nftKeypair.publicKey);
    assert.equal(nftAccount.owner.toBase58(), wallet.publicKey.toBase58());
    assert.equal(nftAccount.name, name);
    assert.equal(nftAccount.symbol, symbol);
    assert.equal(nftAccount.uri, uri);
  });

  it("Creates a donation", async () => {
    const donationKeypair = Keypair.generate();
    const amount = new anchor.BN(100 * LAMPORTS_PER_SOL);
    const currency = "SOL";
    const message = "Test donation";

    await program.methods
      .createDonation(amount, currency, message)
      .accounts({
        donation: donationKeypair.publicKey,
        donor: wallet.publicKey,
        recipient: Keypair.generate().publicKey,
        donorTokenAccount: blinkTokenAccount,
        recipientTokenAccount: await createAccount(
          provider.connection,
          wallet.payer,
          blinkMint,
          Keypair.generate().publicKey
        ),
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([donationKeypair])
      .rpc();

    const donationAccount = await program.account.donation.fetch(donationKeypair.publicKey);
    assert.equal(donationAccount.donor.toBase58(), wallet.publicKey.toBase58());
    assert.equal(donationAccount.amount.toNumber(), amount.toNumber());
    assert.equal(donationAccount.currency, currency);
    assert.equal(donationAccount.message, message);
  });

  it("Creates a swap", async () => {
    const swapKeypair = Keypair.generate();
    const amountA = new anchor.BN(50 * LAMPORTS_PER_SOL);
    const amountB = new anchor.BN(100 * LAMPORTS_PER_SOL);
    const fee = new anchor.BN(1); // 0.1% fee

    await program.methods
      .createSwap(amountA, amountB, fee)
      .accounts({
        swap: swapKeypair.publicKey,
        owner: wallet.publicKey,
        tokenA: blinkTokenAccount,
        tokenB: await createAccount(
          provider.connection,
          wallet.payer,
          await createMint(provider.connection, wallet.payer, wallet.publicKey, null, 9),
          wallet.publicKey
        ),
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([swapKeypair])
      .rpc();

    const swapAccount = await program.account.swap.fetch(swapKeypair.publicKey);
    assert.equal(swapAccount.owner.toBase58(), wallet.publicKey.toBase58());
    assert.equal(swapAccount.amountA.toNumber(), amountA.toNumber());
    assert.equal(swapAccount.amountB.toNumber(), amountB.toNumber());
    assert.equal(swapAccount.fee.toNumber(), fee.toNumber());
  });
});

// Helper function to derive metadata address
async function getMetadataAddress(mint: PublicKey): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    )
  )[0];
}

// Helper function to derive associated token address
async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
}

// Constants
const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");