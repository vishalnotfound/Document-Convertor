const express = require('express');
const multer = require('multer');
const docxToPDF = require('docx-pdf');
const path = require('path');
const cors = require("cors");
const fs = require('fs');

const app = express();

// Use PORT from Render or default to 3001
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Ensure upload and files directories exist
const uploadDir = path.join(__dirname, 'uploads');
const filesDir = path.join(__dirname, 'files');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route for file conversion
app.post('/convertFile', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a file",
            });
        }

        // Define output path for converted PDF
        let outputPath = path.join(filesDir, `${req.file.originalname}.pdf`);

        docxToPDF(req.file.path, outputPath, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error converting docx to pdf",
                });
            }

            res.download(outputPath, () => {
                console.log("File downloaded");
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

// Test route
app.get('/', (req, res) => {
    res.send('Doc Converter API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
