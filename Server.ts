
import express from 'express';
import routes from "./src/Routes"

const app = express();
const PORT = process.env.SERVER_PORT || 3001;


app.use(express.json())
app.use("/api", routes)

app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
})

