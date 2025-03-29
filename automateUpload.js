const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const URL = "https://www.ilovepdf.com/pdf_to_word"; // Target URL
const downloadPath = path.resolve(__dirname, "downloads"); // Directory to save the file

async function automateFileUpload(filePath) {
  const browser = await puppeteer.launch({
    headless: true, // Set to true for headless mode
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Set the download behavior to allow file saving
  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });

  try {
    console.log("🔹 Navigating to iLovePDF...");
    await page.goto(URL, { waitUntil: "networkidle2" });

    console.log("🔹 Clicking the file upload button...");
    const uploadButtonSelector = "#pickfiles";
    await page.waitForSelector(uploadButtonSelector);
    
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),  // Wait for the file chooser
      page.click(uploadButtonSelector),  // Click the button
    ]);
    await fileChooser.accept([filePath]); // Select the file

    console.log("🔹 File uploaded successfully. Waiting for processing...");
    
    // Wait for the processing button to appear
    const processButtonSelector = "#processTask";
    await page.waitForSelector(processButtonSelector, { visible: true });
    await page.click(processButtonSelector); // Click to start processing

    console.log("🔹 Document is being processed. Waiting for the download button...");

    // Wait for the download button to appear
    const downloadButtonSelector = "#pickfiles"; // Adjust the selector if necessary
    await page.waitForSelector(downloadButtonSelector, { visible: true });

    console.log("🔹 Clicking the download button...");
    const [download] = await Promise.all([
      await page.waitForSelector(downloadButtonSelector, { visible: true }),
      page.click(downloadButtonSelector), // Click the download button
    ]);

    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log("✅ File downloaded successfully:");
  } catch (error) {
    console.error("❌ Automation failed:", error);
  } finally {
    await browser.close();
  }}

// Export the function
module.exports = automateFileUpload;
