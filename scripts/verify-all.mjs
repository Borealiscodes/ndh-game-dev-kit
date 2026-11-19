/**
 * scripts/verify-all.mjs — Zero-Dependency Verification Harness
 * Discovers and executes all *.test.mjs suites across math-toys/ and reports
 * pass/fail receipts without external test runners.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function findTestFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findTestFiles(full, acc);
    } else if (entry.endsWith(".test.mjs")) {
      acc.push(full);
    }
  }
  return acc.sort();
}

const testFiles = findTestFiles(".");

if (testFiles.length === 0) {
  console.log("[verify-all] Phase 1 governance check OK (0 test suites registered yet).");
  process.exit(0);
}

console.log(`[verify-all] Running ${testFiles.length} deterministic test suite(s)...`);
const res = spawnSync(process.execPath, ["--test", ...testFiles], { stdio: "inherit" });
process.exit(res.status ?? 1);
