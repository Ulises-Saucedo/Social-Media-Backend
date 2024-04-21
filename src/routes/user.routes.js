import { Router } from "express";
import {
    profile,
    list,
    avatar,
    counter,
    register,
    login,
    upload,
    update,
} from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {
    userSchema,
    updateUserSchema,
    loginSchema,
} from "../schemas/user.schema.js";
import { auth } from "../middlewares/auth.js";
import { uploads } from "../middlewares/multer.js";

const router = Router();

router.get("/profile/:id", auth, profile);
router.get("/list/:page?", auth, list);
router.get("/avatar/:file", auth, avatar);
router.get("/counters/:id?", auth, counter);
router.post("/register", validateSchema(userSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/upload", [auth, uploads], upload);
router.put("/update", auth, validateSchema(updateUserSchema), update);

export default router;
