import crypto from "crypto";
import fs from "fs";
import path from "path";
import axios from "axios";

const keyPath = path.resolve("public/stealth.key");
const logPath = path.resolve("public/rotation-log.json");
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

export async function rotateStealthKey() {
  const newKey = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(newKey).digest("hex");

  fs.writeFileSync(keyPath, newKey, "utf-8");

  const timestamp = new Date().toISOString();
  const log = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, "utf-8"))
    : [];

  log.unshift({ hash, timestamp });
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

  console.log(`🔐 New STEALTH_KEY hash: ${hash}`);

  if (DISCORD_WEBHOOK) {
    await axios.post(DISCORD_WEBHOOK, {
      username: "Sentinel",
      content: `🚨 Stealth Key Rotated\n**SHA256:** \`${hash.slice(0, 12)}...\`\n**Time:** ${timestamp}`,
    });
  }

  return { hash, timestamp };
}

// Auto-run if standalone
if (require.main === module) rotateStealthKey();
