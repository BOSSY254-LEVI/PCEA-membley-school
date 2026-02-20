#!/usr/bin/env node

/**
 * Manifest-driven image optimization pipeline.
 *
 * Source images:        PCEASCH-IMAGES/*.jpg|jpeg|png
 * Optimized output:     PCEASCH-IMAGES/optimized/
 *   - webp/<name>.webp
 *   - webp/<name>-480w.webp, -768w.webp, -1200w.webp
 *   - jpg/<name>.jpg
 *   - jpg/<name>-480w.jpg, -768w.jpg, -1200w.jpg
 *
 * Usage:
 *   npm run optimize:images
 *   npm run optimize:images -- --all
 *   npm run optimize:images -- --all --prune-unused
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_DIR = path.join(__dirname, "PCEASCH-IMAGES");
const MANIFEST_PATH = path.join(__dirname, "image-manifest.json");
const OUTPUT_DIR = path.join(SOURCE_DIR, "optimized");
const OUTPUT_WEBP_DIR = path.join(OUTPUT_DIR, "webp");
const OUTPUT_JPG_DIR = path.join(OUTPUT_DIR, "jpg");
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const RESPONSIVE_WIDTHS = [480, 768, 1200];

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function cleanDirectory(targetDir) {
    if (!fs.existsSync(targetDir)) {
        ensureDir(targetDir);
        return;
    }

    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(targetDir, entry.name);
        if (entry.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
            fs.unlinkSync(fullPath);
        }
    }
}

function listAllSourceImages() {
    return fs
        .readdirSync(SOURCE_DIR, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => SUPPORTED_EXTENSIONS.has(path.extname(name).toLowerCase()))
        .sort();
}

function readManifest() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        throw new Error(`Missing manifest file: ${MANIFEST_PATH}`);
    }

    const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.images)) {
        throw new Error("image-manifest.json must contain an `images` array.");
    }

    return parsed.images;
}

function unique(values) {
    return [...new Set(values)];
}

function normalizeImageList(imageNames) {
    return unique(imageNames)
        .map((name) => name.trim())
        .filter(Boolean)
        .filter((name) => SUPPORTED_EXTENSIONS.has(path.extname(name).toLowerCase()))
        .sort();
}

async function writeOutputs(sourcePath, baseName) {
    await sharp(sourcePath)
        .rotate()
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(path.join(OUTPUT_JPG_DIR, `${baseName}.jpg`));

    await sharp(sourcePath)
        .rotate()
        .webp({ quality: 82 })
        .toFile(path.join(OUTPUT_WEBP_DIR, `${baseName}.webp`));

    for (const width of RESPONSIVE_WIDTHS) {
        await sharp(sourcePath)
            .rotate()
            .resize({ width, withoutEnlargement: true })
            .jpeg({ quality: 78, mozjpeg: true })
            .toFile(path.join(OUTPUT_JPG_DIR, `${baseName}-${width}w.jpg`));

        await sharp(sourcePath)
            .rotate()
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(OUTPUT_WEBP_DIR, `${baseName}-${width}w.webp`));
    }
}

function auditUnusedSourceImages(usedList) {
    const usedSet = new Set(usedList);
    return listAllSourceImages().filter((fileName) => !usedSet.has(fileName));
}

function pruneUnusedSourceImages(unusedList) {
    for (const fileName of unusedList) {
        const fullPath = path.join(SOURCE_DIR, fileName);
        fs.unlinkSync(fullPath);
    }
}

function buildPictureMarkup(fileName, alt, sizes = "(max-width: 860px) 100vw, 50vw") {
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);

    const webpSrcset = RESPONSIVE_WIDTHS.map(
        (w) => `PCEASCH-IMAGES/optimized/webp/${baseName}-${w}w.webp ${w}w`
    ).join(", ");
    const jpgSrcset = RESPONSIVE_WIDTHS.map(
        (w) => `PCEASCH-IMAGES/optimized/jpg/${baseName}-${w}w.jpg ${w}w`
    ).join(", ");

    return `<picture>
    <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">
    <img src="PCEASCH-IMAGES/optimized/jpg/${baseName}.jpg" srcset="${jpgSrcset}" sizes="${sizes}" alt="${alt}" loading="lazy">
</picture>`;
}

async function run() {
    const argv = process.argv.slice(2);
    const useAll = argv.includes("--all");
    const pruneUnused = argv.includes("--prune-unused");

    const manifestList = normalizeImageList(readManifest());
    const allSource = listAllSourceImages();
    const selectedList = useAll ? allSource : manifestList;
    const selectedSet = new Set(selectedList);

    const missing = selectedList.filter((name) => !allSource.includes(name));
    if (missing.length) {
        throw new Error(`Manifest references missing source files: ${missing.join(", ")}`);
    }

    ensureDir(OUTPUT_DIR);
    ensureDir(OUTPUT_WEBP_DIR);
    ensureDir(OUTPUT_JPG_DIR);
    cleanDirectory(OUTPUT_WEBP_DIR);
    cleanDirectory(OUTPUT_JPG_DIR);

    console.log(`Optimizing ${selectedList.length} image(s)...`);
    for (const fileName of selectedList) {
        const sourcePath = path.join(SOURCE_DIR, fileName);
        const baseName = path.basename(fileName, path.extname(fileName));
        await writeOutputs(sourcePath, baseName);
        console.log(`OK: ${fileName}`);
    }

    const unused = allSource.filter((name) => !selectedSet.has(name));
    console.log(`Unused source images: ${unused.length}`);
    if (unused.length) {
        console.log(unused.join("\n"));
    }

    if (pruneUnused) {
        pruneUnusedSourceImages(unused);
        console.log(`Pruned ${unused.length} unused source image(s).`);
    }

    console.log("Image optimization complete.");
}

if (require.main === module) {
    run().catch((error) => {
        console.error(`Image pipeline failed: ${error.message}`);
        process.exitCode = 1;
    });
}

module.exports = {
    run,
    buildPictureMarkup,
    auditUnusedSourceImages
};
