import express from "express";
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import cors from "cors";
import { parse } from "dotenv";

const PORT = environments.port;
const app = express();

//Middlewares
app.use(express.json()); //Esto lo que hace es parsear el JSON del body
app.use(cors());

//Middleware Logger para analizar y registrar las solicitudes
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleDateString()}]${req.method} ${req.url}`);
    next();
})

//Middleware de ruta -> Aplicados a rutas especificas y ejecutadas solo cuando una solicitud coincide con la ruta definida
const validateId = (req, res, next) => {
    //const id = req.params.id;
    const { id } = req.params;

    if(!id || isNaN(id)){
        return res.status(400).json({
            error: "El id debe ser un número"
        })
    }
    //Convertimos el parametro id (originalmente un string porque viene de la url)
    req.id = parseInt(id, 10);

    next();
}



app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.get("/vehiculos", async (req,res) => {
    try{
        let sql = `SELECT * FROM vehiculos`;
        //Al usar [rows] la desestructuración extrae directamente las filas (que es el primer elemento del resultado de la consulta), nos sirve porque hace el codigo mas legible y explicito.
        const [rows] = await connection.query(sql)
    
        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron usuarios" : "Usuarios encontrados"
        })
    } catch(error){
        console.error("Error obteniendo productos", error)
        res.status(500).json({
            error: "Error interno del servidor al obtener productos"
        })
    }
})


app.get("/vehiculos/:id", validateId, async(req, res) => {
    //let id = req.params.id
    try{
        let { id } = req.params;

    let sql = `SELECT * FROM vehiculos where id = ?`;

    let [rows] = await connection.query(sql, [id]);

    if(rows.length === 0){
        return res.status(404).json({
            error: `No se encontro el producto con id ${id}`
        })
    }

    res.status(200).json({
        payload:rows
    });
    }
    catch(error){
        console.error(`Error obteniendo producto con id ${id}`, error.message);

        res.status(500).json({
            error: "Error interno al obtener un producto por id"
        })
    }
})

app.post("/vehiculos", async(req, res) => {
    try {
        let { category, image, name, model, price, km } = req.body;

        if(!category || !image || !name || !model || !price || !km) {
            return res.status(400).json({
                message: "datos inválidos, asegurate de enviar todos los datos"
            });
        }
        // Hacemos uso de placeholders ? para prevenir SQL Injection
        let sql = `INSERT INTO vehiculos (tipo, img, nombre, modelo, precio, km) VALUES (?, ?, ?, ?, ?, ?)`;

        let [rows] = await connection.query(sql, [category, image, name, model, price, km]);

        res.status(201).json({
            message: "Producto creado con éxito",
            productId: rows.insertId
        });

    } catch(error) {
        console.error(error);

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
})

app.put("/vehiculos", async(req, res) =>{
    try{
        let { id, category, image, name, model, price, km} = req.body;

        if(!id || !category || !image || !name || !model || !price || !km) {
            return res.status(400).json({
                message: "Faltan campos requeridos"
            });
        }

        // let sql = `
        //     UPDATE vehiculos
        //     SET tipo = ?, image = ?, name = ?, model = ?, price = ?, km = ?
        //     WHERE id = ?
        // `;

        let sql = `
            UPDATE vehiculos
            SET tipo = ?, img = ?, nombre = ?, modelo = ?, precio = ?, km = ?
            WHERE id = ?
        `;
        
        let [result] = await connection.query(sql, [category, image, name, model, price, km, id])

        //Testeamos que se actualizara.
        if(result.affectedRows === 0){
            return res.status(400).json({
                message: "No se actualizó el vehiculo."
            })
        }

        res.status(200).json({
            message: "Vehiculo actualizado correctamente."
        })

    }catch(error){
        console.error("Error al actualizar el producto", error)

        res.status(400).json({
            message: "Error interno del servidor.",
            error: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})