////////// IMPORTACIONES ///////////////
import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerUrl } from "./src/api/middlewares/middlewares.js";
import { productRoutes } from "./src/api/routes/index.js"; // Importamos las rutas de productos


const PORT = environments.port;
const app = express();


//// Middlewares ////
app.use(express.json()); //Esto lo que hace es parsear el JSON del body
app.use(cors());        //Middleware CORS basico que permite todas las solicitudes
app.use(loggerUrl);


//// RUTAS //////

app.use("/api/vehiculos", productRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})