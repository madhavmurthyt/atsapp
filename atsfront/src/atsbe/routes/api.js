const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const mammoth = require('mammoth');
const path = require('path');
const pdfParse = require('pdf-parse');

const { compareJobDescriptionAndResume } = require('./models/resume');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      if(!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
        fs.chown(uploadDir, process.getuid(), process.getgid()); 
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

// Function to extract text from DOCX files
const extractTextFromDocx = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};
// Function to extract text from PDF files
const extractTextFromPdf = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

router.post('/compare', upload.single('resume'), async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    const filePath = path.join(__dirname, 'uploads', req.file.originalname);
    let resumeContent = '';    
      if (req.file.mimetype === 'application/pdf') {
        resumeContent = await extractTextFromPdf(filePath);
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        resumeContent = await extractTextFromDocx(filePath);

      } else {
        return res.status(400).send('Unsupported file type');
      }
    const result = await compareJobDescriptionAndResume(jobDescription, resumeContent);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;