#!/usr/bin/env node

/**
 * Lightweight static build script.
 * - Minifies HTML, CSS, and JS into /dist
 * - Copies required static folders
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const HTML_FILES = [
    "index.html",
    "about.html",
    "academics.html",
    "admissions.html",
    "student-life.html",
    "contact.html"
];

const CSS_FILES = ["assets/css/main.css"];
const JS_FILES = ["assets/js/site.js", "assets/js/contact-form.js"];
const COPY_FILES = [".htaccess", "_headers"];
const COPY_DIRS = ["PCEASCH-IMAGES", "media", "downloads"];

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function minifyHtml(content) {
    return content
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/>\s+</g, "><")
        .trim();
}

function minifyCss(content) {
    return content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,>])\s*/g, "$1")
        .replace(/;}/g, "}")
        .trim();
}

function minifyJs(content) {
    return content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function readFile(relativePath) {
    return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function writeDistFile(relativePath, content) {
    const outPath = path.join(DIST, relativePath);
    ensureDir(path.dirname(outPath));
    fs.writeFileSync(outPath, content);
}

function copyFileIfExists(relativePath) {
    const src = path.join(ROOT, relativePath);
    if (!fs.existsSync(src)) {
        return;
    }
    const outPath = path.join(DIST, relativePath);
    ensureDir(path.dirname(outPath));
    fs.copyFileSync(src, outPath);
}

function copyDirectoryRecursive(srcDir, destDir) {
    ensureDir(destDir);
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            copyDirectoryRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function buildHtml() {
    HTML_FILES.forEach((file) => {
        const minified = minifyHtml(readFile(file));
        writeDistFile(file, minified);
        console.log(`HTML: ${file}`);
    });
}

function buildCss() {
    CSS_FILES.forEach((file) => {
        const minified = minifyCss(readFile(file));
        writeDistFile(file, minified);
        console.log(`CSS:  ${file}`);
    });
}

function buildJs() {
    JS_FILES.forEach((file) => {
        const minified = minifyJs(readFile(file));
        writeDistFile(file, minified);
        console.log(`JS:   ${file}`);
    });
}

function copyStaticAssets() {
    COPY_FILES.forEach(copyFileIfExists);

    COPY_DIRS.forEach((dir) => {
        const src = path.join(ROOT, dir);
        const dest = path.join(DIST, dir);
        if (fs.existsSync(src)) {
            copyDirectoryRecursive(src, dest);
            console.log(`COPY: ${dir}`);
        }
    });
}

function run() {
    ensureDir(DIST);
    buildHtml();
    buildCss();
    buildJs();
    copyStaticAssets();
    console.log("Build complete. Output directory: dist");
}

run();
