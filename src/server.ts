import express from 'express'
import routes from './routes'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

const app =  express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use("/api", routes)

app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhost:${PORT}`);    
})