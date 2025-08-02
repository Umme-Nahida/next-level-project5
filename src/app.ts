

import express, { Request, Response } from "express"
import { routes } from "./app/routes/routes"
const app = express()

// middlewere
app.use(express.json())
app.use('/api/v1',routes)

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

export default app;

