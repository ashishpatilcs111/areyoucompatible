const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const convertPdfToDocx = require("./convertPdf"); // Import the script
const automateFileUpload = require("./automateUpload");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/resume", upload.single("resume"), async (req, res) => {
  const description = req.body.description;
  const file = req.file;

  if (!file || !description) {
    return res.status(400).json({ message: "Both fields are required" });
  }

  console.log(description);
  console.log(file);

  try {
    const fileName = path.parse(file.originalname).name+".pdf"; // Extract filename without extension
    const filePath = path.join(__dirname,"files");

    // Ensure the save directory exists
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    // Write buffer to file
    fs.writeFile(path.join(filePath,fileName), file.buffer, (err) => {
      if (err) {
        console.log(`Error saving file: ${err}`);
      } else {
        console.log(`File saved successfully at: ${filePath}`);
      }
    });
    // const docxPath = await convertPdfToDocx(file.buffer, fileName);

    // if (!docxPath) {
    //   return res.status(500).json({ message: "Error converting PDF to DOCX" });
    // }

    await automateFileUpload(path.join(filePath,fileName));
    res.json({
      message: "Resume uploaded and converted successfully!",
      fileName: file.originalname,
      docxFilePath: docxPath,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
