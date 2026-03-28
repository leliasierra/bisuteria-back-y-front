/**
 * @typedef {import('../schemas/productSchema.js').Product} Product
 * @typedef {import('../schemas/saleSchema.js').Sale} Sale
 */

import JsonDb from '@kreisler/js-jsondb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new JsonDb(join(__dirname, '../../db'));

const initializeData = () => {
  const products = db.select('products');
  if (products.length === 0) {
    db.insert('products', [
      { id: 1, name: "Collar de perlas", material: "Plata 925", category: "Collares", price: 45000, stock: 15, minStock: 5 },
      { id: 2, name: "Aretes artesanales", material: "Cuentas", category: "Aretes", price: 25000, stock: 20, minStock: 10 },
      { id: 3, name: "Pulsera de di", material: "Hilos", category: "Pulseras", price: 15000, stock: 30, minStock: 15 },
      { id: 4, name: "Cuentas de vidrio", material: "Vidrio", category: "Materiales", price: 500, stock: 100, minStock: 20 },
      { id: 5, name: "Hilos de nylon", material: "Nylon", category: "Materiales", price: 300, stock: 50, minStock: 10 },
      { id: 6, name: "Collar corto", material: "Acero", category: "Collares", price: 18000, stock: 25, minStock: 8 },
      { id: 7, name: "Aretes argolla", material: "Acero", category: "Aretes", price: 12000, stock: 3, minStock: 10 },
      { id: 8, name: "Pulsera pandora", material: "Plata", category: "Pulseras", price: 55000, stock: 8, minStock: 5 },
      { id: 9, name: "Dijes decorativos", material: "Varios", category: "Dijes", price: 3500, stock: 200, minStock: 50 },
      { id: 10, name: "Tobillera", material: "Hilos", category: "Tobilleras", price: 12000, stock: 12, minStock: 5 },
      { id: 11, name: "Cadena para-collar", material: "Plata", category: "Materiales", price: 8000, stock: 40, minStock: 15 },
      { id: 12, name: "Broches", material: "Acero", category: "Accesorios", price: 2000, stock: 150, minStock: 30 },
    ]);
  }

  const sales = db.select('sales');
  if (sales.length === 0) {
    db.insert('sales', [
      { id: 1, productId: 1, productName: "Collar de perlas", quantity: 2, unitPrice: 45000, total: 90000, date: "2026-03-15" },
      { id: 2, productId: 2, productName: "Aretes artesanales", quantity: 1, unitPrice: 25000, total: 25000, date: "2026-03-15" },
      { id: 3, productId: 3, productName: "Pulsera de di", quantity: 3, unitPrice: 15000, total: 45000, date: "2026-03-14" },
    ]);
  }
};

initializeData();

const getNextId = (collection) => {
  const items = db.select(collection);
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
};

/**
 * @returns {Product[]}
 */
export const getAllProducts = () => db.select('products');

/**
 * @param {number} id
 * @returns {Product | undefined}
 */
export const getProductById = (id) => {
  const results = db.select('products', (p) => p.id === id);
  return results[0];
};

/**
 * @param {Omit<Product, 'id'>} data
 * @returns {Product}
 */
export const createProduct = (data) => {
  const product = { ...data, id: getNextId('products') };
  db.insert('products', product);
  return product;
};

/**
 * @param {number} id
 * @param {Partial<Product>} data
 * @returns {Product | null}
 */
export const updateProduct = (id, data) => {
  db.update('products', (p) => p.id === id, data);
  return getProductById(id);
};

/**
 * @param {number} id
 * @returns {boolean}
 */
export const deleteProduct = (id) => {
  const before = db.select('products').length;
  db.delete('products', (p) => p.id === id);
  return db.select('products').length < before;
};

/**
 * @returns {Sale[]}
 */
export const getAllSales = () => db.select('sales');

/**
 * @param {number} id
 * @returns {Sale | undefined}
 */
export const getSaleById = (id) => {
  const results = db.select('sales', (s) => s.id === id);
  return results[0];
};

/**
 * @param {Omit<Sale, 'id'>} data
 * @returns {Sale}
 */
export const createSale = (data) => {
  const sale = { ...data, id: getNextId('sales') };
  db.insert('sales', sale);
  return sale;
};

/**
 * @param {number} id
 * @returns {boolean}
 */
export const deleteSale = (id) => {
  const before = db.select('sales').length;
  db.delete('sales', (s) => s.id === id);
  return db.select('sales').length < before;
};
