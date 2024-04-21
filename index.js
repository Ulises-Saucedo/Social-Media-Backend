import "dotenv/config";
import "./src/database/db.js";
import cors from "cors";
import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import publicationRoutes from "./src/routes/publication.routes.js";
import followRoutes from "./src/routes/follow.routes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/follows", followRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
