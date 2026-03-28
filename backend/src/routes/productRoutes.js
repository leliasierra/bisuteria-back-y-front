import { Router } from 'express';
import { getProducts, getProduct, addProduct, editProduct, removeProduct } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';

/** @type {import('express').Router} */
const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticateToken, addProduct);
router.put('/:id', authenticateToken, editProduct);
router.delete('/:id', authenticateToken, removeProduct);

export default router;
