
import express from 'express';
import routes from "./Routes";
import cors from "cors";

const app = express();
const PORT =  process.env.SERVER_PORT || 3030;

app.use(cors());
app.use(express.json())
app.use("/api", routes)

app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
})

