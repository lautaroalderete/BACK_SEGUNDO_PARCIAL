// Modelo Producto //

import connection from "../database/db.js"; // Importamos la conexion a la BBDD


//////////////////////////////////////
// Seleccionar todos los productos //
const selectAllProducts = async() => {
    let sql = `SELECT * FROM vehiculos WHERE estado=1`;
    
    // Al usar [rows] la desestructuracion extrae directamente las filas (que es el primer elemento del resultado de la consulta), nos sirve porque hace el codigo mas legible y explicito
    return await connection.query(sql);
}


// Seleccionar producto por su id //
const selectProductFromId = async (id) => {
    
    let sql = `SELECT * FROM vehiculos where id = ?`;

    return await connection.query(sql, [id]);
}


const insertNewProduct = async (category, image, name, model, price, km) => {
    let sql = `INSERT INTO vehiculos (tipo, img, nombre, modelo, precio, km) VALUES (?, ?, ?, ?, ?, ?)`;
    return await connection.query(sql, [category, image, name, model, price, km]);
}


// Actualizar producto //
const updateProduct = async(id, category, image, name, model, price, km) => {
    let sql = `
            UPDATE vehiculos
            SET tipo = ?, img = ?, nombre = ?, modelo = ?, precio = ?, km = ?
            WHERE id = ?
        `;
    return await connection.query(sql, [category, image, name, model, price, km, id]);
}


// Eliminar producto //
const deleteProduct = async (id) => {
    let sql = "UPDATE vehiculos SET estado = 0 WHERE id = ?";

    return await connection.query(sql, [id]);
}


export default {
    selectAllProducts,
    selectProductFromId,
    insertNewProduct,
    updateProduct,
    deleteProduct
}