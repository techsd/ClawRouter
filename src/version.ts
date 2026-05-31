/**
 * Single source of truth for version.
 * Reads from package.json at build time via tsup's define.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Read package.json at runtime
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In dist/, go up one level to find package.json
const require = createRequire(import.meta.url);
const pkg = require(join(__dirname, "..", "package.json")) as { version: string };

export const VERSION = pkg.version;

/**
 * Optional client tag appended to the User-Agent so upstream (BlockRun) can
 * attribute traffic to the host that launched the proxy — e.g. the Hermes
 * plugin sets `CLAWROUTER_CLIENT=hermes-plugin/<version>`, yielding a UA like
 * `clawrouter/0.12.198 hermes-plugin/0.3.0`. Standalone use is unchanged.
 *
 * Sanitized to a safe token set so the env value can't inject CR/LF or other
 * header-breaking characters.
 */
function clientTag(): string {
  const raw = (process.env.CLAWROUTER_CLIENT ?? "").trim();
  if (!raw) return "";
  const safe = raw.replace(/[^A-Za-z0-9._/+-]/g, "");
  return safe ? ` ${safe}` : "";
}

export const USER_AGENT = `clawrouter/${VERSION}${clientTag()}`;
