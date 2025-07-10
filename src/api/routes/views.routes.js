import { Router } from "express";
import { validateId } from "../middlewares/middlewares.js";
import { createProduct } from "../controllers/product.controllers.js";
import { vistaConsultarId, vistaCrear, vistaEliminar, vistaListado, vistaModificar } from "../controllers/views.controllers.js";

const router = Router();

//Vistas
router.get("/", vistaListado)

router.get("/consultar", vistaConsultarId)

router.get("/crear", vistaCrear)

router.get("/modificar", vistaModificar)

router.get("/eliminar", vistaEliminar)

export default router;