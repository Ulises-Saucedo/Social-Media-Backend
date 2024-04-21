import { Router } from "express";
import {
    saveFollow,
    unfollow,
    following,
    followers,
} from "../controllers/follow.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/following/:id?/:page?", auth, following);
router.get("/followers/:id?/:page?", auth, followers);
router.post("/save", auth, saveFollow);
router.delete("/unfollow/:id", auth, unfollow);

export default router;
