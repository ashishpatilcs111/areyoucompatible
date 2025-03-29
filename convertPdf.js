const fs = require("fs");
const path = require("path");

// Ensure the output directory exists
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function convertPdfToDocx(buffer, fileName) {
  try {
    // Define input and output file paths
    const inputPath = path.join(outputDir, `${fileName}.pdf`);
    const outputPath = path.join(outputDir, `${fileName}.docx`);

    // Save buffer as temporary PDF file
    fs.writeFileSync(inputPath, buffer);

    // Convert PDF to DOCX
    const converter = new Converter();
    await converter.convert(inputPath, outputPath);
    converter.close(); // Clean up resources

    console.log(`DOCX file saved: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error("Error converting PDF:", error);
    return null;
  }
}

module.exports = convertPdfToDocx;
