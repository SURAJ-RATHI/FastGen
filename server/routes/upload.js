import express from "express"
import multer from 'multer'
import fs from 'fs'
import path from "path"
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize upload
const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 10000000 } // Limit file size to 10MB
});

// upload files - require authentication
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
try {
    if(!req.file){
        return res.status(400).json({error: 'No file uploaded'})
    }
    
    console.log('Upload request from user:', req.user.userId);
    console.log('File details:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    
    const filePath = req.file.path
    const originalName = req.file.originalname
    let parsedText = ''

if (originalName.endsWith('.pdf')) {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const loadingTask = pdfjsLib.getDocument({ data });

      const pdf = await loadingTask.promise;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        const pageText = strings.join(' ');
        parsedText += pageText + '\n\n';
      }    
    } else {
      return res.status(400).json({ error: 'Only PDF files are supported. Please upload a PDF file.' })
    }

    // ✅ Save parsed text to a new file
    const parsedFileName = `parsed-${req.file.filename}.txt`
    const parsedFilePath = path.join('uploads', parsedFileName)

    fs.writeFileSync(parsedFilePath, parsedText, 'utf8')

    // ✅ Delete the original uploaded file (but keep the parsed file for later use)
    fs.unlinkSync(filePath)

    console.log('File successfully parsed and saved:', parsedFileName);
    console.log('Parsed file path:', parsedFilePath);
    console.log('Parsed file size:', parsedText.length, 'characters');

    res.json({
      message: 'File uploaded and parsed!',
      parsedFileName: parsedFileName  // return this to frontend
    })

  } catch (err) {
    console.error('Upload error:', err);
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error('Failed to cleanup uploaded file:', cleanupErr);
      }
    }
    
    res.status(500).json({ error: 'Failed to upload & parse file' });
  }
});

export default router;
