import {Server} from "http"
import app from "./app";
import mongoose from "mongoose";
import { envVars } from "./app/confic/env";


let server: Server;
const port = 3000

const startServer = async()=>{
   await mongoose.connect(envVars.DB_URL)
    console.log('mongodb connected successfully')
    server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}

startServer()