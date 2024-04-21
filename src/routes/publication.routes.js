import { Router } from "express";
import {
    detailPublication,
    userPublications,
    media,
    feed,
    savePublication,
    upload,
    deletePublication,
} from "../controllers/publication.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { publicationSchema } from "../schemas/publication.schema.js";
import { auth } from "../middlewares/auth.js";
import { uploadsPublications } from "../middlewares/multer.js";

const router = Router();

router.get("/detail/:id", auth, detailPublication);
router.get("/user/:id/:page?", auth, userPublications);
router.get("/media/:file", auth, media);
router.get("/feed/:page?", auth, feed);
router.post("/save", auth, validateSchema(publicationSchema), savePublication);
router.post("/upload/:id", [auth, uploadsPublications], upload);
router.delete("/remove/:id", auth, deletePublication);

export default router;
