/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

import { getAllSales, getSaleById, createSale, deleteSale } from '../models/data.js';
import { getProductById, updateProduct } from '../models/data.js';
import { saleSchema, saleIdSchema } from '../schemas/saleSchema.js';

/**
 * @param {Request} req
 * @param {Response} res
 */
export const getSales = (req, res) => {
  res.json(getAllSales());
};

/**
 * @param {Request} req
 * @param {Response} res
 */
export const getSale = (req, res) => {
  const parseResult = saleIdSchema.safeParse(req.params);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }
  
  const sale = getSaleById(parseResult.data.id);
  if (!sale) {
    return res.status(404).json({ error: 'Venta no encontrada' });
  }
  res.json(sale);
};

/**
 * @param {Request} req
 * @param {Response} res
 */
export const addSale = (req, res) => {
  const parseResult = saleSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }
  
  const { productId, quantity } = parseResult.data;
  const product = getProductById(productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Stock insuficiente' });
  }
  
  const sale = createSale({
    productId,
    productName: product.name,
    quantity,
    unitPrice: product.price,
    total: product.price * quantity,
    date: new Date().toISOString().split('T')[0],
  });
  
  updateProduct(productId, { stock: product.stock - quantity });
  
  res.status(201).json(sale);
};

/**
 * @param {Request} req
 * @param {Response} res
 */
export const removeSale = (req, res) => {
  const parseResult = saleIdSchema.safeParse(req.params);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }
  
  const deleted = deleteSale(parseResult.data.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Venta no encontrada' });
  }
  res.status(204).send();
};
