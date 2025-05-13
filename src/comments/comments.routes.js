import { Router } from "express";
import { check } from "express-validator";
import { listMyCommit, deleteCommit, addCommitTo, updtateCommit } from "./comments.controller.js";
import { existPublicationById } from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"

const router = Router();

router.post(
    "/:id", 
    [
        check("id").custom(existPublicationById),
        check("comment", "Comment is required").not().isEmpty(),
        check("comment", "The comment must have at least 5 characters").isLength({ min: 5, max: 500 }),
        validarCampos
    ],
    addCommitTo
);

router.get(
    "/",
    [
        validarJWT
    ],
    listMyCommit
);

router.put(
    "/:id",
    updtateCommit
)

router.delete(
    "/:id",
    [
        check("id", "ID no válido").isMongoId(),
        validarCampos
    ],
    deleteCommit
);

export default router;