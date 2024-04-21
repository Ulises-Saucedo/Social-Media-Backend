import jwt from "jsonwebtoken";
import moment from "moment";

export const auth = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token)
        return res.status(401).json({
            status: "error",
            message: "No se ha mandado ningun token",
        });

    token = token.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (decoded.exp <= moment().unix())
            return res.status(401).json({
                status: "error",
                message: "El token ha expirado",
            });

        req.user = decoded;

        next();
    } catch (e) {
        return res.status(401).json({
            status: "error",
            message: "Token no válido",
        });
    }
};
