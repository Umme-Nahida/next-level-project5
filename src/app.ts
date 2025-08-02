

import express, { Request, Response } from "express"
import { routes } from "./app/routes/routes"
import cors from "cors"
import cookieParser from "cookie-parser";
import passport from "passport";
import "./app/confic/passport"
import expressSession from "express-session"
const app = express()


// middlewere
app.use(expressSession({
  secret:"your secret",
  resave:false,
  saveUninitialized:false
  
}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use('/api/v1',routes)

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

export default app;

