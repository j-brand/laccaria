#!/usr/bin/env node
/**
 * Convert images (png/jpg/jpeg/tiff) to WebP using sharp (already a Next.js dep).
 *
 * Usage:
 *   npm run webp                         # convert every PNG/JPG under public/
 *   npm run webp -- public/projects/foo  # convert a single file or folder
 *   npm run webp -- img.png --thumb      # also emit img_thumb.webp (max 400px)
 *   npm run webp -- img.png --crop 16:10 # emit img_thumb.webp cropped to the TOP at 16:10
 *   npm run webp -- img.png -q 90        # set quality (default 82)
 *   npm run webp -- img.png --keep       # keep originals (default: keep too)
 *
 * Flags:
 *   -q, --quality <n>   WebP quality 1-100 (default 82)
 *   --thumb             also write a <name>_thumb.webp downscaled to --max px
 *   --crop <W:H>        write a <name>_thumb.webp cropped to the TOP at aspect W:H,
 *                       then downscaled to --max px wide. Use for very tall full-page
 *                       screenshots whose tiles render with `object-cover object-top`
 *                       (a plain --thumb would collapse them to a sliver). Implies a
 *                       thumb; --max is the target WIDTH in crop mode (default 400).
 *   --max <n>           thumbnail size in px (longest edge for --thumb, width for --crop)
 *   --force             overwrite existing .webp outputs (default: skip)
 */
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_EXT = new Set([".png", ".jpg", ".jpeg", ".tif", ".tiff"]);

const argv = process.argv.slice(2);
const opts = { quality: 82, thumb: false, crop: null, max: 400, force: false, inputs: [] };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "-q" || a === "--quality") opts.quality = Number(argv[++i]);
  else if (a === "--thumb") opts.thumb = true;
  else if (a === "--crop") { opts.crop = argv[++i]; opts.thumb = true; }
  else if (a === "--max") opts.max = Number(argv[++i]);
  else if (a === "--force") opts.force = true;
  else if (a === "--keep") { /* originals are always kept; accepted for clarity */ }
  else opts.inputs.push(a);
}
if (opts.inputs.length === 0) opts.inputs.push("public");

async function collect(target) {
  const s = await stat(target).catch(() => null);
  if (!s) {
    console.warn(`  skip (not found): ${target}`);
    return [];
  }
  if (s.isFile()) return SRC_EXT.has(path.extname(target).toLowerCase()) ? [target] : [];
  const entries = await readdir(target, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(target, e.name);
    if (e.isDirectory()) files.push(...(await collect(full)));
    else if (SRC_EXT.has(path.extname(e.name).toLowerCase())) files.push(full);
  }
  return files;
}

async function convert(file) {
  const dir = path.dirname(file);
  const base = path.basename(file, path.extname(file));
  const out = path.join(dir, `${base}.webp`);

  if (existsSync(out) && !opts.force) {
    console.log(`  skip (exists): ${out}  — use --force to overwrite`);
  } else {
    await sharp(file).webp({ quality: opts.quality }).toFile(out);
    console.log(`  ✓ ${file} → ${out}`);
  }

  if (opts.thumb) {
    const thumb = path.join(dir, `${base}_thumb.webp`);
    if (existsSync(thumb) && !opts.force) {
      console.log(`  skip (exists): ${thumb}`);
    } else if (opts.crop) {
      const [aw, ah] = opts.crop.split(":").map(Number);
      const { width, height } = await sharp(file).metadata();
      const cropH = Math.min(height, Math.round((width * ah) / aw));
      await sharp(file)
        .extract({ left: 0, top: 0, width, height: cropH })
        .resize({ width: opts.max, withoutEnlargement: true })
        .webp({ quality: opts.quality })
        .toFile(thumb);
      console.log(`  ✓ ${file} → ${thumb}  (top ${opts.crop} crop)`);
    } else {
      await sharp(file)
        .resize({ width: opts.max, height: opts.max, fit: "inside", withoutEnlargement: true })
        .webp({ quality: opts.quality })
        .toFile(thumb);
      console.log(`  ✓ ${file} → ${thumb}`);
    }
  }
}

const files = (await Promise.all(opts.inputs.map(collect))).flat();
if (files.length === 0) {
  console.log("No PNG/JPG/TIFF images found to convert.");
  process.exit(0);
}
console.log(`Converting ${files.length} image(s) at quality ${opts.quality}${opts.thumb ? `, thumbs ≤${opts.max}px` : ""}:`);
for (const f of files) await convert(f);
console.log("Done. Originals left in place — delete them once you've checked the WebP output.");
