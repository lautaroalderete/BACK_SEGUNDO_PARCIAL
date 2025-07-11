import { Router } from "express"; // Importamos el middleware express.Router
import { validateId } from "../middlewares/middlewares.js";
import { createProduct, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";

const router = Router();

// 1. GET -> Traer todos los productos
router.get("/", getAllProducts);

// 2. GET by id -> Traer producto por su id
// TODO, hacer middleware validateId
router.get("/:id", validateId, getProductById);

// 3. POST -> Crear nuevos productos
router.post("/", createProduct);

// 4. Cuarto endpoint -> Update 
router.put("/", modifyProduct);

// 5. Quinto endpoint -> Delete 
router.delete("/:id", removeProduct);

router.post("/compras", (req, res) => {
    const productos = req.body.productos;

    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ message: "Carrito vacío" });
    }

    console.log("Compra simulada:", productos);
    return res.status(200).json({ message: "Compra registrada (simulada) con éxito" });
});

export default router; // Exportamos las rutas