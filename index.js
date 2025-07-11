////////// IMPORTACIONES ///////////////
import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerUrl } from "./src/api/middlewares/middlewares.js";
import { productRoutes, viewsRoutes } from "./src/api/routes/index.js";
import { join, __dirname } from "./src/api/utils/index.js";

console.log("Hola");

const PORT = environments.port;
const app = express();

console.log(`🚀 Iniciando servidor en puerto ${PORT}`);

//Configuramos EJS como motor de plantillas
app.set("view engine", "ejs")

// Definimos la ruta donde estan almacenadas las plantillas .ejs, con join combinamos el directorio raiz del proyecto con src/views
app.set("views", join(__dirname, "src/views"))

// Configuramos Express para que sirva archivos estaticos desde la carpeta public/, archivos como style.css, logo.png seran accesibles via HTTP
app.use(express.static(join(__dirname, "src/public")))

//// Middlewares ////
app.use(express.json()); // Parsear JSON del body
app.use(cors()); // CORS básico
app.use(loggerUrl);

//// RUTAS //////
app.use("/api/vehiculos", productRoutes);

app.use("/dashboard", viewsRoutes)

// Ruta de prueba simple
app.get('/api/test', (req, res) => {
    res.json({
        message: "Servidor funcionando correctamente",
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/api`);
    console.log(`🧪 Prueba: http://localhost:${PORT}/api/test`);
})