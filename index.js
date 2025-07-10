////////// IMPORTACIONES ///////////////
import express from "express";
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerUrl } from "./src/api/middlewares/middlewares.js";
import { productRoutes } from "./src/api/routes/index.js";

const PORT = environments.port;
const app = express();

console.log(`🚀 Iniciando servidor en puerto ${PORT}`);

//// Middlewares ////
app.use(express.json()); // Parsear JSON del body
app.use(cors()); // CORS básico
app.use(loggerUrl);

//// RUTAS //////
app.use("/api/vehiculos", productRoutes);

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