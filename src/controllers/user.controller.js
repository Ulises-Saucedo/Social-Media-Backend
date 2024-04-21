import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import Publication from "../models/publication.model.js";
import { createAccessToken } from "../libs/jwt.js";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import { followUserIds, followThisUser } from "../libs/followUserIds.js";

export const register = async (req, res) => {
    const body = req.body;

    try {
        const userFound = await User.findOne({
            $or: [{ email: body.email }, { nick: body.nick }],
        });
        if (userFound)
            return res
                .status(400)
                .json({ status: "error", message: "El usuario ya existe" });

        const passwordHash = await bcrypt.hash(body.password, 10);

        const newUser = new User({ ...body, password: passwordHash });

        const savedUser = await newUser.save();

        res.status(201).json({
            status: "success",
            message: "Usuario registrado correctamente",
            user: savedUser,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: e.message,
        });
    }
};

export const login = async (req, res) => {
    const body = req.body;

    try {
        const userFound = await User.findOne({ email: body.email });
        if (!userFound)
            return res
                .status(400)
                .json({ status: "error", message: "El usuario no existe" });

        const isPasswordMatch = await bcrypt.compare(
            body.password,
            userFound.password
        );
        if (!isPasswordMatch)
            return res
                .status(400)
                .json({ status: "error", message: "Credenciales incorrectas" });

        const token = await createAccessToken(userFound);

        res.json({
            status: "success",
            message: "Usuario autenticado correctamente",
            user: {
                id: userFound._id,
                name: userFound.name,
                nick: userFound.nick,
            },
            token,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: e.message,
        });
    }
};

export const profile = async (req, res) => {
    const { id } = req.params;

    try {
        const userFound = await User.findById(id).select("-password -role");
        if (!userFound)
            return res
                .status(404)
                .json({ status: "error", message: "El usuario no existe" });

        const followInfo = await followThisUser(req.user.id, id);

        res.json({
            status: "success",
            user: userFound,
            following: followInfo.following,
            follower: followInfo.follower,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: e.message,
        });
    }
};

export const list = async (req, res) => {
    const { page } = req.params;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: 5,
        select: "-password -role -email -__v",
    };

    try {
        const users = await User.paginate({}, options);

        const followUsersIds = await followUserIds(req.user.id);

        res.json({
            status: "success",
            users: users.docs,
            users_following: followUsersIds.followingClean,
            users_follower: followUsersIds.followersClean,
            page: users.page,
            itemsPerPage: users.limit,
            total: users.totalDocs,
            pages: users.totalPages,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: e.message,
        });
    }
};

export const update = async (req, res) => {
    const userIdentity = req.user;
    const userToUpdate = {
        ...(req.body ? { ...req.body } : {}),
        ...(req.file ? { image: req.file.filename } : {}),
    };

    try {
        const userFound = await User.findById(userIdentity.id);
        if (!userFound)
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe",
            });

        if (!userFound._id.equals(userIdentity.id))
            return res.status(400).json({
                status: "error",
                message: "No tienes permisos para actualizar este usuario",
            });

        if (userToUpdate.password) {
            userToUpdate.password = await bcrypt.hash(
                userToUpdate.password,
                10
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            userIdentity.id,
            userToUpdate,
            { new: true }
        );

        res.json({
            status: "success",
            user: updatedUser,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: "Error al actualizar usuario",
        });
    }
};

export const upload = async (req, res) => {
    const userIdentity = req.user;

    try {
        const userFound = await User.findById(userIdentity.id);
        if (!userFound)
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe",
            });

        if (!userFound._id.equals(userIdentity.id))
            return res.status(400).json({
                status: "error",
                message: "No tienes permisos para actualizar este usuario",
            });

        const updatedUser = await User.findByIdAndUpdate(
            userIdentity.id,
            { image: req.file.filename },
            { new: true }
        );

        res.json({
            status: "success",
            user: updatedUser,
            file: req.file,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: "Error al subir la imagen de perfil",
        });
    }
};

export const avatar = (req, res) => {
    const { file } = req.params;

    const filePath = "./uploads/avatars/" + file;

    fs.stat(filePath, (error, exists) => {
        if (!exists)
            return res.status(404).json({
                status: "error",
                message: "El archivo no existe",
            });

        return res.sendFile(path.resolve(filePath));
    });
};

export const counter = async (req, res) => {
    let userId = req.user.id;
    if (req.params.id) userId = req.params.id;

    try {
        const following = await Follow.countDocuments({ user: userId });

        const followed = await Follow.countDocuments({ followed: userId });

        const publications = await Publication.countDocuments({ user: userId });

        res.json({
            userId,
            following,
            followed,
            publications,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: "Error al contar datos",
        });
    }
};
