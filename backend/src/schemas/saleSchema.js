import { z } from 'zod';

/**
 * @typedef {Object} Sale
 * @property {number} id
 * @property {number} productId
 * @property {string} productName
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} total
 * @property {string} date
 */

/**
 * @typedef {Object} SaleInput
 * @property {number} productId
 * @property {number} quantity
 */

export const saleSchema = z.object({
  productId: z.number().int().positive('El ID del producto debe ser positivo'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
});

export const saleIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * @type {z.ZodType<SaleInput>}
 */
export const SaleSchema = saleSchema;
