import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'ALkYCupPNacgRGwleEuAhmj2wfOoVyRv',
    socket: {
        host: 'redis-15049.c265.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 15049
    }
});

client.on('error', err => console.log('Redis Client Error', err));

export const connectRedis = async()=>{
    if(!client.isOpen){
        await client.connect();
    }
}

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

