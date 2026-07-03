// src/main.ts
// STOS V2.3.2 Entry Point

import DenoConnector from "./connectors/deno-connector.ts";

const config = {
  webhookHost: Deno.env.get("WEBHOOK_HOST") || "localhost",
  webhookPort: parseInt(Deno.env.get("WEBHOOK_PORT") || "8000"),
  webhookUrl: Deno.env.get("WEBHOOK_URL") || "https://localhost:8000",
  ownerId: parseInt(Deno.env.get("OWNER_ID") || "0"),
  botToken: Deno.env.get("TELEGRAM_BOT_TOKEN") || "",
  kvPath: Deno.env.get("KV_PATH") || "database",
};

if (!config.botToken || config.ownerId === 0) {
  console.error(
    "❌ Missing required environment variables: TELEGRAM_BOT_TOKEN, OWNER_ID"
  );
  Deno.exit(1);
}

const connector = new DenoConnector(config);

// Event listeners
connector.on("initialized", () => {
  console.log("🚀 STOS V2.3.2 initialized and ready");
});

connector.on("step:12-dispatch", (results) => {
  console.log(`📤 Bot API dispatch completed:`, results);
});

connector.on("pipeline:error", (error) => {
  console.error("❌ Pipeline error:", error);
});

// Initialize connector
try {
  await connector.initialize();

  // Graceful shutdown handler
  Deno.addSignalListener("SIGINT", async () => {
    console.log("\n🛑 Received SIGINT, shutting down...");
    await connector.shutdown();
    Deno.exit(0);
  });

  console.log("✅ STOS V2.3.2 Running");
  console.log(`📡 Webhook: ${config.webhookUrl}`);
  console.log(`👤 Owner ID: ${config.ownerId}`);
} catch (error) {
  console.error("❌ Failed to start:", error);
  Deno.exit(1);
}
