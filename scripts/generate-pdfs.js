#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const DOWNLOADS_DIR = path.join(__dirname, "..", "downloads");

function writePdf(fileName, title, lines) {
    const outputPath = path.join(DOWNLOADS_DIR, fileName);
    const doc = new PDFDocument({ size: "A4", margin: 56 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    doc.fontSize(18).text("PCEA MEMBLEY SCHOOL", { align: "left" });
    doc.moveDown(0.2);
    doc.fontSize(14).text(title);
    doc.moveDown(0.8);

    doc.fontSize(11).text("Membley Estate, Church Road, Ruiru, Kiambu County, Kenya");
    doc.text("Phone: +254 756 428 414");
    doc.text("Email: pceasmembleyschool@gmail.com");
    doc.moveDown(0.8);

    lines.forEach((line) => {
        doc.text(line, { lineGap: 3 });
    });

    doc.moveDown(1.2);
    doc.fontSize(10).fillColor("#4b5b77").text("Generated from the school website document pipeline.");
    doc.end();

    return new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
    });
}

async function run() {
    if (!fs.existsSync(DOWNLOADS_DIR)) {
        fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
    }

    await writePdf("application-package.pdf", "Application Package", [
        "1. Fill and sign the admission form.",
        "2. Attach learner birth certificate copy.",
        "3. Attach parent or guardian ID copy.",
        "4. Add two passport-size photographs.",
        "5. Include latest academic report for transfer students.",
        "6. Submit documents through the admissions desk."
    ]);

    await writePdf("fee-schedule.pdf", "Fee Schedule Guide", [
        "Fee components may include tuition, resources, meals, and optional transport.",
        "Final fee amounts are provided by the accounts office by class level and term.",
        "Contact the accounts desk for official fee advice and payment timelines."
    ]);

    await writePdf("admissions-prospectus.pdf", "Admissions Prospectus", [
        "Academic levels: Pre-Primary, Primary, and Junior Secondary.",
        "Values focus: integrity, discipline, and Christ-centered learning.",
        "Support areas: academics, co-curricular pathways, and learner wellbeing.",
        "For guided enrollment support, contact admissions at +254 756 428 414."
    ]);

    console.log("PDF documents generated in downloads/.");
}

run().catch((error) => {
    console.error(`PDF generation failed: ${error.message}`);
    process.exitCode = 1;
});
