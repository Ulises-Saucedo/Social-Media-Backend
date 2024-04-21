import Publication from "../models/publication.model.js";
import User from "../models/user.model.js";
import path from "path";
import fs from "fs";
import { followUserIds } from "../libs/followUserIds.js";

export const savePublication = async (req, res) => {
    const params = req.body;

    const publication = new Publication(params);
    publication.user = req.user.id;

    try {
        const newPublication = await publication.save();
        if (!newPublication)
            return res.status(400).json({
                status: "error",
                message: "No se pudo guardar la publicación",
            });

        res.status(200).json({
            status: "success",
            message: "Publicación guardada",
            publication,
        });
    } catch (e) {
        return res.status(400).json({
            status: "error",
            message: "No se pudo guardar la publicación",
        });
    }
};

export const detailPublication = async (req, res) => {
    const publicationId = req.params.id;

    try {
        const publication = await Publication.findById(publicationId);
        if (!publication)
            return res.status(400).json({
                status: "error",
                message: "No se encontró la publicación",
            });

        res.status(200).json({
            status: "success",
            publication,
        });
    } catch (e) {
        return res.status(400).json({
            status: "error",
            message: "No se encontró la publicación",
        });
    }
};

export const deletePublication = async (req, res) => {
    const publicationId = req.params.id;

    try {
        const publication = await Publication.findOne({
            user: req.user.id,
            _id: publicationId,
        });
        if (!publication)
            return res.status(404).json({
                status: "error",
                message: "No se encontró la publicación",
            });

        await publication.deleteOne();

        res.status(200).json({
            status: "success",
            message: "Publicación eliminada",
        });
    } catch (e) {
        return res.status(400).json({
            status: "error",
            message: "No se encontró la publicación",
        });
    }
};

export const userPublications = async (req, res) => {
    const userId = req.params.id;

    let page = 1;
    if (req.params.page) page = req.params.page;

    const options = {
        page: parseInt(page, 10) || 1,
        limit: 5,
        sort: "-createdAt",
        populate: {
            path: "user",
            select: "-password -__v -role -email",
        },
    };

    try {
        const userPublications = await Publication.paginate(
            {
                user: { $eq: userId },
            },
            options
        );
        if (userPublications.docs.length === 0)
            return res.status(404).json({
                status: "error",
                message: "No se encontraron publicaciones",
            });

        res.json({
            status: "success",
            publications: userPublications.docs,
            page: userPublications.page,
            itemsPerPage: userPublications.limit,
            total: userPublications.totalDocs,
            pages: userPublications.totalPages,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: "No se encontraron publicaciones",
        });
    }
};

export const upload = async (req, res) => {
    const userIdentity = req.user.id;
    const publicationId = req.params.id;

    try {
        const userFound = await User.findById(userIdentity);
        if (!userFound)
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe",
            });

        const updatedPublication = await Publication.findOneAndUpdate(
            { user: userIdentity, _id: publicationId },
            { file: req.file.filename },
            { new: true }
        );
        if (!updatedPublication)
            return res.status(404).json({
                status: "error",
                message: "No se encontró la publicación",
            });

        res.json({
            status: "success",
            publication: updatedPublication,
            file: req.file,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: "Error al subir la imagen de la publicación",
        });
    }
};

export const media = (req, res) => {
    const { file } = req.params;

    const filePath = "./uploads/publications/" + file;

    fs.stat(filePath, (error, exists) => {
        if (!exists)
            return res.status(404).json({
                status: "error",
                message: "El archivo no existe",
            });

        return res.sendFile(path.resolve(filePath));
    });
};

export const feed = async (req, res) => {
    let page = 1;
    if (req.params.page) page = req.params.page;

    const options = {
        page: parseInt(page, 10) || 1,
        limit: 5,
        sort: "-createdAt",
        populate: {
            path: "user",
            select: "-password -__v -role -email",
        },
    };

    try {
        const myFollows = await followUserIds(req.user.id);

        const publications = await Publication.paginate(
            {
                user: {
                    $in: myFollows.followingClean,
                },
            },
            options
        );

        res.json({
            status: "success",
            publications: publications.docs,
            myFollows: myFollows.followingClean,
            page: publications.page,
            itemsPerPage: publications.limit,
            total: publications.totalDocs,
            pages: publications.totalPages,
        });
    } catch (e) {
        return res.status(500).json({
            status: "error",
            message: "No se han listado las publicaciones del feed",
        });
    }
};
