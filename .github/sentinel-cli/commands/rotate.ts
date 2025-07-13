// sentinel-cli/commands/rotate.ts
import { Command } from "commander";
import { rotateKey } from "../utils/stealth-key-rotation";

export const rotate = new Command("rotate")
  .description("Rotate the STEALTH_KEY and log hash")
  .action(async () => {
    const hash = await rotateKey();
    console.log(`✅ STEALTH_KEY rotation complete. Hash: ${hash}`);
  });
// sentinel-cli/index.ts
import { rotate } from "./commands/rotate";

program.addCommand(rotate);
