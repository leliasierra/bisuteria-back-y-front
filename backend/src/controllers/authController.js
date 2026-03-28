/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

import { getUserByUsername, userExists, createUser } from '../models/userModel.js';
import { userSchema } from '../schemas/userSchema.js';
import { generateToken } from '../middleware/auth.js';

export const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  const user = getUserByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, username: user.username } });
};

export const register = (req, res) => {
  const parseResult = userSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  const { username, password } = parseResult.data;

  if (userExists(username)) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  const user = createUser({ username, password });
  const token = generateToken(user);

  res.status(201).json({ token, user: { id: user.id, username: user.username } });
};
