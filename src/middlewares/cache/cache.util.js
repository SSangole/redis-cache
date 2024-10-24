import hash from 'object-hash';
import { redisClient, isRedisConnected } from '../redis.js';

const getKeyForRequest = (req) => {
    const reqDataToHash = {
        param: req.params,
        query: req.query,
        body: req.body,
    };
    return `${req.path}@${hash.sha1(reqDataToHash)}`;
}

const defaultCacheOption = {
    EX: 60 * 60* 24, // 24 hour
};

const writeDataToCache = async (key, data, option = defaultCacheOption ) => {
    if (isRedisConnected()) {
        try {
            // write data to Redis
            await redisClient.set(key, data, option);
        } catch (error) {
            console.error(`Error encountered in Redis client: ${error}`); 
        }
    }
}

const readDataFromCache = async (key) => {
    let cachedValue = null;

    if (isRedisConnected()) {
        // read data from Redis
       cachedValue = await redisClient.get(key);
        if(cachedValue !== null) {
            return JSON.parse(cachedValue);
        }
    }
    return cachedValue;
}

const deleteDataFromCache = async (key) => {
    if (isRedisConnected()) {
        await redisClient.del(key);
    }
}

export { getKeyForRequest, readDataFromCache, writeDataToCache, deleteDataFromCache };