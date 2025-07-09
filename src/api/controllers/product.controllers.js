import connection from "../database/db.js";
import Products from "../models/product.models.js";


// Get all products
export const getAllProducts = async (req,res) => {
    try{
        /*
        let sql = `SELECT * FROM vehiculos`;
        Al usar [rows] la desestructuración extrae directamente las filas (que es el primer elemento del resultado de la consulta), nos sirve porque hace el codigo mas legible y explicito.*/
        const [rows] = await Products.selectAllProducts();
    
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
}


// Get product by id
export const getProductById = async(req, res) => {
    try{
        let { id } = req.params;
        /*
        let sql = `SELECT * FROM vehiculos where id = ?`;

        let [rows] = await connection.query(sql, [id]); */

        const [rows] = await Products.selectProductFromId(id);

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
}


// Create new product
export const createProduct = async(req, res) => {
    try {
        let { category, image, name, model, price, km } = req.body;

        if(!category || !image || !name || !model || !price || !km) {
            return res.status(400).json({
                message: "datos inválidos, asegurate de enviar todos los datos"
            });
        }
        /*
        // Hacemos uso de placeholders ? para prevenir SQL Injection
        let sql = `INSERT INTO vehiculos (tipo, img, nombre, modelo, precio, km) VALUES (?, ?, ?, ?, ?, ?)`; 

        let [rows] = await connection.query(sql, [category, image, name, model, price, km]); */

        const [rows] = await Products.insertNewProduct(category, image, name, model, price, km);

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
}


// Modify product
export const modifyProduct = async(req, res) =>{
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
        
        /*
        let sql = `
            UPDATE vehiculos
            SET tipo = ?, img = ?, nombre = ?, modelo = ?, precio = ?, km = ?
            WHERE id = ?
        `;
        */

        let [result] = await Products.updateProduct(id, category, image, name, model, price, km)

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
}


// Remove product
export const removeProduct = async (req, res) => {
    try {
        let { id } = req.params;
        if(!id) {
            return res.status(400).json({
                message: "Se requiere un id para eliminar el producto",
            })
        }
        /*
        let sql = "DELETE FROM vehiculos WHERE id = ?"; */

        let [result] = await Products.deleteProduct(id);

        //Testeamos que se eliminara.
        if(result.affectedRows === 0){
            return res.status(400).json({
                message: `No se encontró un producto con id ${id}`
            });
        }

        return res.status(200).json({
            message: `Producto con id ${id} eliminado correctamente`
        });
    } catch(error) {
        console.error("Error en DELETE vehiculos/:id", error);

        res.status(500).json({
            message: `Error al eliminar producto con id ${id}`, error,
            error:error.message
        })
    }
}