#!/usr/bin/env node
/**
 * Convert all .png / .jpg / .jpeg images under public/images/ to WebP.
 * Removes the original file after successful conversion.
 *
 * Run: node scripts/convert-to-webp.mjs
 * Or:  npx node scripts/convert-to-webp.mjs
 */

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const IMAGES_DIR = path.join(ROOT, "public", "images");
const QUALITY = 85;
const CONVERT_EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return [full];
    })
  );
  return files.flat();
}

function fmtKB(bytes) {
  return (bytes / 1024).toFixed(1).padStart(7) + " KB";
}

async function convertOne(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  if (!CONVERT_EXTS.has(ext)) return null;

  const newPath = filepath.slice(0, -ext.length) + ".webp";
  const originalSize = (await fs.stat(filepath)).size;

  await sharp(filepath)
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(newPath);

  const newSize = (await fs.stat(newPath)).size;
  await fs.unlink(filepath);

  return { filepath, newPath, originalSize, newSize };
}

async function main() {
  console.log(`\n  Converting images in: ${IMAGES_DIR}`);
  console.log(`  Quality: ${QUALITY}    Effort: 6 (max)\n`);

  let files;
  try {
    files = await walk(IMAGES_DIR);
  } catch (err) {
    console.error(`  ERROR walking ${IMAGES_DIR}:`, err.message);
    process.exit(1);
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let converted = 0;
  let skipped = 0;

  for (const file of files.sort()) {
    try {
      const result = await convertOne(file);
      if (!result) {
        skipped++;
        continue;
      }
      totalBefore += result.originalSize;
      totalAfter += result.newSize;
      converted++;
      const pct =
        ((1 - result.newSize / result.originalSize) * 100).toFixed(0) + "%";
      const rel = path.relative(ROOT, result.filepath);
      console.log(
        `    ${rel}\n      ${fmtKB(result.originalSize)} -> ${fmtKB(
          result.newSize
        )}  (-${pct})`
      );
    } catch (err) {
      console.error(`    FAILED ${file}:`, err.message);
    }
  }

  const totalSaved =
    totalBefore > 0
      ? ((1 - totalAfter / totalBefore) * 100).toFixed(1)
      : "0.0";
  console.log(
    `\n  Converted ${converted} file(s), skipped ${skipped} non-image file(s).`
  );
  console.log(
    `  Total: ${fmtKB(totalBefore)} -> ${fmtKB(totalAfter)}  (-${totalSaved}%)\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
