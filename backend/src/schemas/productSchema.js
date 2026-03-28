import { z } from 'zod';

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} material
 * @property {string} category
 * @property {number} price
 * @property {number} stock
 * @property {number} minStock
 */

/**
 * @typedef {Object} ProductInput
 * @property {string} name
 * @property {string} material
 * @property {string} category
 * @property {number} price
 * @property {number} stock
 * @property {number} minStock
 */

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  material: z.string().min(1, 'El material es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  price: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int().nonnegative('El stock debe ser un entero no negativo'),
  minStock: z.number().int().nonnegative('El stock mínimo debe ser un entero no negativo'),
});

export const productUpdateSchema = productSchema.partial();

export const productIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * @type {z.ZodType<ProductInput>}
 */
export const ProductSchema = productSchema;

/**
 * @type {z.ZodType<Partial<ProductInput>>}
 */
export const ProductUpdateSchema = productUpdateSchema;
