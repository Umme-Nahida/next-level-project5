import {Server} from "http"
import app from "./app";
import mongoose from "mongoose";
import { envVars } from "./app/confic/env";
import { connectRedis } from "./app/confic/redis.config";


let server: Server;
const port = 5000

const startServer = async()=>{
   await mongoose.connect(envVars.DB_URL)
    console.log('mongodb connected successfully')
    server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}

 (async()=>{
    await startServer()
    await connectRedis()
 })()

process.on('SIGTERM',()=>{

    console.log('sigtern is recieved and shutting down our server..');
    
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('SIGINT',()=>{

    console.log('SIGINT SIGNAL is recieved and shutting down our server..');
    
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('unhandledRejection',(err)=>{

    console.log('unhandleRejection error is detected',err);
    
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

// uncaght rejection err handling
process.on('uncaughtException',(err)=>{

    console.log('uncaughtException error is detected',err);
    
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})