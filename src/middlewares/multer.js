import multer from "multer";

const storage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./uploads/avatars");
        },
        filename: (req, file, cb) => {
            cb(null, "avatar-" + Date.now() + "-" + file.originalname);
        },
    }),
    fileFilter: (req, file, cb) => {
        const ACCEPTED_IMAGE_TYPES = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
            return cb(new Error("Formato de imagen no válido"));
        }

        cb(null, true);
    },
}).single("image");

export const uploads = (req, res, next) => {
    storage(req, res, (e) => {
        if (e instanceof multer.MulterError) {
            return res.status(400).json({ message: e.message });
        } else if (e) {
            return res.status(400).json({ message: e.message });
        }

        next();
    });
};

const uploadPublications = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./uploads/publications");
        },
        filename: (req, file, cb) => {
            cb(null, "pub-" + Date.now() + "-" + file.originalname);
        },
    }),
    fileFilter: (req, file, cb) => {
        const ACCEPTED_IMAGE_TYPES = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
            return cb(new Error("Formato de imagen no válido"));
        }

        cb(null, true);
    },
}).single("file");

export const uploadsPublications = (req, res, next) => {
    uploadPublications(req, res, (e) => {
        if (e instanceof multer.MulterError) {
            return res.status(400).json({ message: e.message });
        } else if (e) {
            return res.status(400).json({ message: e.message });
        }

        next();
    });
};
