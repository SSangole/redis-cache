import { createClient } from 'redis';
import envs from '../configs/envs.js';

let redisClient = undefined;
async function initializeRedisClient() {
    let redisURL = envs.redis_uri; // To connect to a different host or port
    if (redisURL === undefined) {
        throw new Error('REDIS_URI is not set in .env file');
    } 
    redisClient = createClient({ url: redisURL}).on("error", (e) => {
        console.error(`Error encountered in Redis client: ${e}`);
    });
    
    try {
        await redisClient.connect();
        console.log('Redis client connected');
    } catch (error) {
        console.error(`Error encountered in Redis client: ${error}`);
    }
}

function isRedisConnected() {
    return !!redisClient?.isOpen;
};

function closeRedisClient() {
    redisClient.quit();
}

export { initializeRedisClient, isRedisConnected, closeRedisClient, redisClient }; 