import express from 'express';

const app = express();
app.use(express.json());

import { initializeRedisClient } from './middlewares/redis.js';
await initializeRedisClient();

import { getAllUsers, getOneUser, updateUserById } from './controllers/user.js';
import { redisUserCacheMiddleware } from './middlewares/cache/user.js';
app.get('/api/v1/users', redisUserCacheMiddleware, getAllUsers);
app.get('/api/v1/users/:id', redisUserCacheMiddleware, getOneUser);
app.post('/api/v1/users/update/:id', updateUserById);

export default app;