import { createClient } from 'redis';
import { envVars } from './env';

export const client = createClient({
    username: envVars.REDIS_USERNAME,
    password: envVars.REDIS_PASSWORD,
    socket: {
        host: envVars.REDIS_HOST,
        port: parseInt(envVars.REDIS_PORT)
    }
});

client.on('error', err => console.log('Redis Client Error', err));

export const connectRedis = async()=>{
    if(!client.isOpen){
        await client.connect();
        console.log('redis is connected')
    }
}

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

