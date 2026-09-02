/**
 * Prisma schema validation via the bundled WASM schema engine.
 *
 * The native `prisma validate` / `prisma generate` CLI downloads a schema
 * engine binary from binaries.prisma.sh, which is blocked in this
 * environment. Prisma 7 ships an equivalent WASM engine
 * (@prisma/prisma-schema-wasm) which validates schemas offline — this script
 * runs that validation against prisma/schema-v2.prisma (the schema configured
 * in prisma.config.ts).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

globalThis.PRISMA_WASM_PANIC_REGISTRY = {
  set_message(m) {
    this.m = m;
  },
  get() {
    return this.m;
  },
};

const wasm = await import("@prisma/prisma-schema-wasm");
const schemaPath = path.join(root, "prisma", "schema-v2.prisma");
const schema = fs.readFileSync(schemaPath, "utf8");

try {
  wasm.validate(JSON.stringify({ prismaSchema: schema, noColor: true }));
  console.log(`✓ prisma schema valid (WASM schema engine): ${path.relative(root, schemaPath)}`);
} catch (e) {
  console.error(
    `✕ prisma schema INVALID:\n` +
      (globalThis.PRISMA_WASM_PANIC_REGISTRY.m || e.message)
  );
  process.exit(1);
}
