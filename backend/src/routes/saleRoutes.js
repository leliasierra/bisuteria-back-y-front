import { Router } from 'express';
import { getSales, getSale, addSale, removeSale } from '../controllers/saleController.js';
import { authenticateToken } from '../middleware/auth.js';

/** @type {import('express').Router} */
const router = Router();

router.get('/', getSales);
router.get('/:id', getSale);
router.post('/', authenticateToken, addSale);
router.delete('/:id', authenticateToken, removeSale);

export default router;
