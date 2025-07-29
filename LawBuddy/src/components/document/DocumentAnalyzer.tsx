import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { motion } from 'framer-motion';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyDhyuXj2KLCclCsN_-yDr0NuOOLIRQQnls");

const DocumentAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);

  // Extract text from image using Tesseract
  const extractTextFromImage = async (file: File): Promise<string> => {
    const result = await Tesseract.recognize(file, 'eng');
    return result.data.text;
  };

  // Handle file upload (only image files)
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/')) {
      setError('Only image files are supported.');
      setFile(null);
      setSummary(null);
      setOcrText(null);
      return;
    }
    setFile(selectedFile);
    setError(null);
    setSummary(null);
    setOcrText(null);
    setLoading(true);
    try {
      // OCR
      const extractedText = await extractTextFromImage(selectedFile);
      setOcrText(extractedText);
      // Gemini summary
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a legal expert AI. Read the following extracted text from a legal document image, and generate a detailed, well-structured, and elongated summary. Your summary should:
- Be easy for a layperson to understand
- Organize information into logical sections with clear headings
- Use bullet points, lists, and short paragraphs where appropriate
- Highlight key points, obligations, rights, dates, and any important legal implications
- Avoid copying the original text verbatim
- Use a professional and visually clear style

Extracted Text:
${extractedText}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setSummary(response.text());
    } catch (err) {
      setError('Failed to process or analyze the image.');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom color="primary">Document Analyzer</Typography>
          <Typography variant="body1" gutterBottom>
            Upload an image of a legal document. The system will extract the text and provide a summary using Gemini.
          </Typography>
          <Box mt={3} mb={2}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              color="primary"
              disabled={loading}
            >
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
          </Box>
          {loading && <CircularProgress sx={{ mt: 2 }} />}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {summary && (
            <Box mt={4}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 2, sm: 4 },
                  background: 'linear-gradient(135deg, #f0fdf4 60%, #e0f2fe 100%)',
                  borderRadius: 4,
                  boxShadow: '0 4px 32px 0 rgba(34,197,94,0.08)',
                  maxHeight: 420,
                  overflowY: 'auto',
                  border: '1.5px solid #bae6fd',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 48px 0 rgba(34,197,94,0.18)',
                  },
                }}
              >
                <Typography variant="h5" color="primary" sx={{ mb: 1, fontWeight: 700, letterSpacing: 1 }}>
                  Document Summary
                </Typography>
                <Divider sx={{ mb: 2, background: 'linear-gradient(90deg, #2563eb, #38bdf8)' }} />
                <Box sx={{
                  fontSize: { xs: 15, sm: 18 },
                  color: '#334155',
                  lineHeight: 1.8,
                  wordBreak: 'break-word',
                  fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
                  whiteSpace: 'pre-wrap',
                }}>
                  {summary}
                </Box>
              </Paper>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default DocumentAnalyzer;