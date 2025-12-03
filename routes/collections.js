import express from 'express';
import collectionsController from '../controllers/collectionsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected
router.use(authMiddleware);

// Collections
router.post('/create', collectionsController.createCollection);
router.get('/', collectionsController.getCollections);
router.get('/:id', collectionsController.getCollection);
router.put('/:id', collectionsController.updateCollection);
router.delete('/:id', collectionsController.deleteCollection);

// Collection items
router.post('/add-item', collectionsController.addToCollection);
router.put('/items/:id', collectionsController.updateCollectionItem);
router.delete('/items/:id', collectionsController.deleteCollectionItem);

export default router;