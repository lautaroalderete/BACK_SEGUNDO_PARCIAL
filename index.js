import express from "express";
import environments from "./src/api/config/environments.js";

const PORT = environments.port;
const app = express();

app.get("/", (req, res) => {
    res.send("Hola mundo");
})

app.get("/autos", async (req,res) =>{
    try{
        let sql = `SELECT * FROM autos`;
        //Al usar [rows] la desestructuración extrae directamente las filas (que es el primer elemento del resultado de la consulta), nos sirve porque hace el codigo mas legible y explicito.
        const [rows] = await connection.query(sql)
    
        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron usuarios" : "Usuarios encontrados"
        })
    }catch(error){
        console.error("Error obteniendo productos", error)
        res.status(500).json({
            error: "Error interno del servidor al obtener productos"
        })
    }
})

app.listen(3000, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})