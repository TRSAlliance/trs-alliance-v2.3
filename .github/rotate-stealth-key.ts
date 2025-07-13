// scripts/rotate-stealth-key.ts
import crypto from "crypto";
import fs from "fs";
import axios from "axios";

const STEALTH_KEY_PATH = "./secrets/stealth.key";
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || "";
const POST_TO_DISCORD = Boolean(DISCORD_WEBHOOK);

function generateStealthKey(): string {
  const key = crypto.randomBytes(32).toString("hex"); // 256-bit
  return key;
}

async function rotateKey() {
  const key = generateStealthKey();
  fs.writeFileSync(STEALTH_KEY_PATH, key, { encoding: "utf8" });

  const hash = crypto.createHash("sha256").update(key).digest("hex");
  console.log(`✅ New STEALTH_KEY generated`);
  console.log(`🔐 SHA256: ${hash}`);

  if (POST_TO_DISCORD) {
    await axios.post(DISCORD_WEBHOOK, {
      username: "TRS Sentinel",
      content: `🔁 **STEALTH_KEY rotated**
\`\`\`
SHA256: ${hash}
Time: ${new Date().toISOString()}
\`\`\``,
    });
    console.log("📡 Rotation broadcast sent to Discord.");
  }

  return hash;
}

rotateKey().catch((err) => {
  console.error("❌ Key rotation failed", err);
  process.exit(1);
});
