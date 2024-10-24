import { isRedisConnected } from "../redis.js";
import { getKeyForRequest, readDataFromCache, writeDataToCache } from "./cache.util.js";

async function redisUserCacheMiddleware(req, res, next) {
    if (isRedisConnected()){
        const key = getKeyForRequest(req);
        
        const cachedUser = await readDataFromCache(key);
        if (cachedUser !== null) {
            try {
                console.log('Cache hit', cachedUser);
                res.json(JSON.parse(cachedUser)); // if it is JSON data, then return it
            } catch (error) {
                res.send(cachedUser); // if it is not JSON data, then return it as it is
            }
        } else {
            console.log('Cache miss');
            const oldSend = res.send;
            res.send = async function (body) {
                if (res.statusCode.toString().startsWith('2')) {
                    // if the response status code is 2xx, then cache the response
                    // we are caching body so that it will be passed as a body when cache hit
                   await writeDataToCache(key, body);
                }
                res.send = oldSend; // restore the original send function
                return res.send(body); // send the response
            }
            // continue with the next function in the middleware chain
            next();
        }
    }
    else {
        next();
    }
}
    
export { redisUserCacheMiddleware };