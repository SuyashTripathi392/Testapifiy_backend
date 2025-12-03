import express from 'express';
import historyController from '../controllers/historyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected
router.use(authMiddleware);

router.post('/save', historyController.saveToHistory);
router.get('/', historyController.getHistory);
router.delete('/:id', historyController.deleteFromHistory);
router.delete('/', historyController.clearHistory);

export default router;