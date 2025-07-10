import Products from "../models/product.models.js";

export const vistaListado = async (req, res) =>{
    try{

        const respuestaProductos = await Products.selectAllProducts();

        res.render("index", {
        title: "Nuestros productos",
        products: respuestaProductos[0]
        });
        
    }catch(error){

    }
}

export const vistaConsultarId = async (req, res) =>{
    res.render("consultar", {
        title: "Consultar producto por id"
    });
}

export const vistaCrear = async (req, res) =>{
    res.render("Crear", {
        title: "Crear producto"
    });
}

export const vistaModificar = async (req, res) =>{
    res.render("modificar", {
        title: "Modificar producto"
    });
}

export const vistaEliminar = async (req, res) =>{
    res.render("eliminar", {
        title: "Eliminar producto"
    });
}