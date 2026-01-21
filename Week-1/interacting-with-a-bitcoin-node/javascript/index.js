const Client = require("bitcoin-core");
const fs = require("fs");
const path = require("path");

// Bitcoin RPC connection configuration
const RPC_CONFIG = {
  network: "regtest",
  username: "alice",
  password: "password",
  port: 18443,
  host: "127.0.0.1"
};

const WALLET_NAME = "testwallet";
const RECIPIENT_ADDRESS = "bcrt1qq2yshcmzdlznnpxx258xswqlmqcxjs4dssfxt2";
const OP_RETURN_MESSAGE = "We are all Satoshi!!";
const FEE_RATE = 21; // sats per vByte

async function main() {
  console.log("Starting Bitcoin transaction creation...\n");

  // Step 1: Create base RPC client (without wallet)
  const baseClient = new Client(RPC_CONFIG);

  // Step 2: Create or load the wallet
  console.log("[1] Setting up wallet...");
  try {
    await baseClient.createWallet(WALLET_NAME);
    console.log(`✓ Created wallet: ${WALLET_NAME}`);
  } catch (error) {
    // Wallet already exists, try to load it
    if (error.message && error.message.includes("already exists")) {
      console.log(`✓ Wallet already exists`);
      try {
        await baseClient.loadWallet(WALLET_NAME);
        console.log(`✓ Loaded wallet`);
      } catch (loadErr) {
        console.log(`✓ Wallet already loaded`);
      }
    } else {
      throw error;
    }
  }

  // Step 3: Create wallet-specific RPC client
  const walletClient = new Client({
    ...RPC_CONFIG,
    wallet: WALLET_NAME
  });

  // Step 4: Generate a new address for mining
  console.log("\n[2] Generating mining address...");
  const miningAddr = await walletClient.getNewAddress();
  console.log(`✓ Mining address: ${miningAddr}`);

  // Step 5: Mine MORE blocks to get enough spendable coins
  // Each block gives 50 BTC, we need at least 100 BTC
  // Mine 201 blocks (need 100 confirmations, plus enough for 100+ BTC)
  console.log("\n[3] Mining blocks to get funds...");
  await walletClient.generateToAddress(201, miningAddr);
  console.log("✓ Mined 201 blocks");

  // Wait for node to process
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Step 6: Check balance
  const balance = await walletClient.getBalance();
  console.log(`✓ Balance: ${balance} BTC`);

  // Step 7: Prepare the OP_RETURN data
  console.log("\n[4] Preparing transaction...");
  const messageHex = Buffer.from(OP_RETURN_MESSAGE, "utf8").toString("hex");
  console.log(`  Payment: 100 BTC to ${RECIPIENT_ADDRESS}`);
  console.log(`  OP_RETURN: "${OP_RETURN_MESSAGE}"`);

  // Step 8: Create transaction outputs
  const outputs = {
    [RECIPIENT_ADDRESS]: 100,
    data: messageHex
  };

  // Step 9: Create raw transaction
  console.log("\n[5] Creating raw transaction...");
  const rawTx = await walletClient.createRawTransaction([], outputs);
  console.log("✓ Raw transaction created");

  // Step 10: Fund the transaction with proper fee rate
  console.log("\n[6] Funding transaction...");
  const fundedTx = await walletClient.fundRawTransaction(rawTx, {
    fee_rate: FEE_RATE  // 21 sats/vB
  });
  console.log(`✓ Funded (fee rate: ${FEE_RATE} sats/vB)`);

  // Step 11: Sign the transaction
  console.log("\n[7] Signing transaction...");
  const signedTx = await walletClient.signRawTransactionWithWallet(fundedTx.hex);
  
  if (!signedTx.complete) {
    throw new Error("Transaction signing failed");
  }
  console.log("✓ Transaction signed");

  // Step 12: Broadcast the transaction
  console.log("\n[8] Broadcasting transaction...");
  const txid = await walletClient.sendRawTransaction(signedTx.hex);
  console.log("✓ Transaction broadcast!");
  console.log(`✓ TXID: ${txid}`);

  // Step 13: Save txid to out.txt
  console.log("\n[9] Saving transaction ID...");
  const outPath = path.resolve(__dirname, "..", "out.txt");
  fs.writeFileSync(outPath, txid);
  console.log(`✓ Saved to out.txt`);

  // Step 14: Mine a confirmation block
  console.log("\n[10] Mining confirmation block...");
  await walletClient.generateToAddress(1, miningAddr);
  console.log("✓ Transaction confirmed");

  console.log("\n" + "=".repeat(60));
  console.log("SUCCESS!");
  console.log("=".repeat(60));
}

// Execute
main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ ERROR:", error.message);
    console.error(error);
    process.exit(1);
  });