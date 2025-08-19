

import express, { Request, Response } from "express"
import { routes } from "./app/routes/routes"
import cors from "cors"
import cookieParser from "cookie-parser";
import passport from "passport";
import "./app/confic/passport"
import expressSession from "express-session"
import { globalErrHandler } from "./app/middlewares/glovalErrHandler";
import httpStatus from "http-status-codes"
const app = express()


// middlewere
app.use(express.json())
app.use(cookieParser())

// express-session first
app.use(expressSession({
  secret:"your secret",
  resave:false,
  saveUninitialized:false
  
}))

// passport middlewares after session
app.use(passport.initialize())
app.use(passport.session())

// cors
app.use(cors({
  origin:["http://localhost:5173"],
  credentials:true
}))

// route endpoint
app.use('/api/v1',routes)


app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})


app.use(globalErrHandler);

// 404 handler 
app.use((req:Request, res:Response)=>{
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message:"Page not fount"
  })
})  


export default app;

