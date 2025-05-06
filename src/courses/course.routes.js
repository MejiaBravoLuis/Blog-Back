import { Router } from "express";
import { check } from "express-validator";
import { addCategory, listCategories, deleteCategory, updateCategory } from "./course.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-jwt.js"
import { existCourse } from "../helpers/db-validator.js"
import { tieneRole } from "../middlewares/validar-role.js"

const router = Router();

router.get(
    "/",
    listCategories
)

router.post(
    "/",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("name", "The name is required").not().isEmpty(),
        validarCampos
    ],
    addCategory
)


router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("id", "This id ins't valid").isMongoId(),
        check("id").custom(existCourse),
        validarCampos
    ],
    updateCategory
)


router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("id", "This id ins't valid").isMongoId(),
        check("id").custom(existCourse),
        validarCampos,
    ],
    deleteCategory
);

export default router;
