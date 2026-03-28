/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} password
 */

import JsonDb from '@kreisler/js-jsondb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new JsonDb(join(__dirname, '../../db'));

const initializeUsers = () => {
  const users = db.select('users');
  if (users.length === 0) {
    db.insert('users', [
      { id: 1, username: "admin", password: "admin123" },
      { id: 2, username: "vendedor", password: "vendedor123" },
    ]);
  }
};

initializeUsers();

const getNextId = (collection) => {
  const items = db.select(collection);
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
};

/**
 * @returns {User[]}
 */
export const getAllUsers = () => db.select('users');

/**
 * @param {string} username
 * @returns {User | undefined}
 */
export const getUserByUsername = (username) => {
  const results = db.select('users', (u) => u.username === username);
  return results[0];
};

/**
 * @param {Omit<User, 'id'>} data
 * @returns {User}
 */
export const createUser = (data) => {
  const user = { ...data, id: getNextId('users') };
  db.insert('users', user);
  return user;
};

/**
 * @param {string} username
 * @returns {boolean}
 */
export const userExists = (username) => {
  return getUserByUsername(username) !== undefined;
};
