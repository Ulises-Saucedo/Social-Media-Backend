export const validateSchema = (schema) => (req, res, next) => {
    try {
        if (req.file) {
            const body = { image: req.file, ...req.body };
            schema.parse(body);
        } else {
            schema.parse(req.body);
        }
        next();
    } catch (error) {
        return res
            .status(400)
            .json({
                status: "error",
                message: error.errors.map((error) => error.message),
            });
    }
};
