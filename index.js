import express from "express";
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";

const PORT = environments.port;
const app = express();

//Middlewares
app.use(cors());

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

app.get("/motos", async (req,res) =>{
    try{
        let sql = `SELECT * FROM motos`;
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

app.get("/autos/:id", async(req, res) => {
    //let id = req.params.id
    try{
        let { id } = req.params;

    let sql = `SELECT * FROM autos where id = ?`;

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
            error: "Error intero al obtener producto por id"
        })
    }
})

app.get("/motos/:id", async(req, res) => {
    //let id = req.params.id
    try{
        let { id } = req.params;

    let sql = `SELECT * FROM motos where id = ?`;

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
            error: "Error intero al obtener producto por id"
        })
    }
})

app.listen(3000, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})