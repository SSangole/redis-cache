import dotenv from 'dotenv';
dotenv.config();

const envs = {
    redis_uri: process.env.REDIS_URI,
    port: process.env.PORT,
}

export default envs;