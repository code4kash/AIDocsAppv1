import express from 'express';
import { authenticate } from '../middleware/auth';
import { aiService } from '../services/aiService';

const router = express.Router();

// Analyze document
router.post('/analyze/:documentId', authenticate, async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;
    
    const result = await aiService.analyzeDocument(documentId, userId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Generate document summary
router.post('/summarize/:documentId', authenticate, async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;
    
    const summary = await aiService.generateDocumentSummary(documentId, userId);
    res.json({ summary });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Answer question about document
router.post('/ask/:documentId', authenticate, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { question } = req.body;
    const userId = req.user.id;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    const answer = await aiService.answerQuestion(documentId, userId, question);
    res.json({ answer });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

export default router; 