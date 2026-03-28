/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../models/data.js';
import { productSchema, productUpdateSchema, productIdSchema } from '../schemas/productSchema.js';

/**
 * @param {Request} req
 * @param {Response} res
 */
export const getProducts = (req, res) => {
  res.json(getAllProducts());
};

/**
 * @param {Request} req
 * @param {Response} res
 */
export const getProduct = (req, res) => {
  const parseResult = productIdSchema.safeParse(req.params);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }
  
  const product = getProductById(parseResult.data.id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
};

/**
 * @param {Request} req
 * @param {Response} res
 */
export const addProduct = (req, res) => {
  const parseResult = productSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }
  
  const product = createProduct(parseResult.data);
  res.status(201).json(product);
};

/**
 * @param {Request} req
 * @param {Response} res
 */
export const editProduct = (req, res) => {
  const idParse = productIdSchema.safeParse(req.params);
  if (!idParse.success) {
    return res.status(400).json({ error: idParse.error.errors });
  }
  
  const bodyParse = productUpdateSchema.safeParse(req.body);
  if (!bodyParse.success) {
    return res.status(400).json({ error: bodyParse.error.errors });
  }
  
  const product = updateProduct(idParse.data.id, bodyParse.data);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
};

/**
 * @param {Request} req
 * @param {Response} res
 */
export const removeProduct = (req, res) => {
  const parseResult = productIdSchema.safeParse(req.params);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }
  
  const deleted = deleteProduct(parseResult.data.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.status(204).send();
};
