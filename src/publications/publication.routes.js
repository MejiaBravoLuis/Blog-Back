import { Router } from "express";
import { check } from "express-validator";

import {
    getPublication,
    addPublication,
    updatePublication,
    deletePublication,
    addCommitTo, getPublicationsByCourseName
} from "./publication.controller.js";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existPublication } from "../helpers/db-validator.js";

const router = Router();

router.get("/", getPublication);

router.post(
    "/",
    [
        validarJWT,
        check("title", "Title is required").not().isEmpty(),
        check("ppalText", "Main text is required").not().isEmpty(),
        check("courseName", "Course name is required").not().isEmpty(),
        validarCampos
    ],
    addPublication
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "The ID is not valid").isMongoId(),
        check("id").custom(existPublication),
        validarCampos
    ],
    updatePublication
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "The ID is not valid").isMongoId(),
        check("id").custom(existPublication),
        validarCampos
    ],
    deletePublication
);

router.post(
    "/commit/:id",
    [
        validarJWT,
        check("id", "The ID is not valid").isMongoId(),
        check("id").custom(existPublication),
        check("comment", "Comment is required").not().isEmpty(),
        validarCampos
    ],
    addCommitTo
);

router.get(
    "/course/:name",
    getPublicationsByCourseName
);


export default router;
