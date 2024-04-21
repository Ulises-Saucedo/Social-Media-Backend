import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import { followUserIds } from "../libs/followUserIds.js";

export const saveFollow = async (req, res) => {
    const { followed } = req.body;
    const identity = req.user;

    try {
        const userToFollow = new Follow({
            user: identity.id,
            followed: followed,
        });

        const followStored = await userToFollow.save();

        res.json({
            status: "success",
            identity,
            follow: followStored,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: "No se ha podido seguir al usuario",
        });
    }
};

export const unfollow = async (req, res) => {
    const { id } = req.params;
    const identity = req.user.id;

    try {
        const userToUnfollow = await Follow.findOneAndDelete({
            user: identity,
            followed: id,
        });
        if (!userToUnfollow)
            return res.status(404).json({
                status: "error",
                message: "No existe el usuario",
            });

        res.json({
            status: "success",
            message: "Has dejado de seguir al usuario correctamente",
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: "No se ha podido dejar de seguir al usuario",
        });
    }
};

export const following = async (req, res) => {
    let identity = req.user.id;
    if (req.params.id) identity = req.params.id;

    let page = 1;
    if (req.params.page) page = req.params.page;

    const options = {
        page: parseInt(page, 10) || 1,
        limit: 5,
        populate: [
            { path: "user", select: "-password -role -__v -email" },
            { path: "followed", select: "-password -role -__v -email" },
        ],
    };

    try {
        const follows = await Follow.paginate(
            {
                user: { $eq: identity },
            },
            options,
            async (e, result) => {
                if (e) {
                    return res.status(404).json({
                        status: "error",
                        message: e.message,
                    });
                }

                let followUsersIds = await followUserIds(identity);

                result.following = followUsersIds.followingClean;
                result.followers = followUsersIds.followersClean;

                return result;
            }
        );

        res.json({
            status: "success",
            follows: follows.docs,
            user_following: follows.following,
            users_follow_me: follows.followers,
            page: follows.page,
            itemsPerPage: follows.limit,
            total: follows.totalDocs,
            pages: follows.totalPages,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: e.message,
        });
    }
};

export const followers = async (req, res) => {
    let identity = req.user.id;
    if (req.params.id) identity = req.params.id;

    let page = 1;
    if (req.params.page) page = req.params.page;

    const options = {
        page: parseInt(page, 10) || 1,
        limit: 5,
        populate: [
            { path: "user", select: "-password -role -__v -email" },
            { path: "followed", select: "-password -role -__v -email" },
        ],
    };

    try {
        const follows = await Follow.paginate(
            {
                followed: { $eq: identity },
            },
            options,
            async (e, result) => {
                if (e) {
                    return res.status(404).json({
                        status: "error",
                        message: e.message,
                    });
                }

                let followUsersIds = await followUserIds(identity);

                result.following = followUsersIds.followingClean;
                result.followers = followUsersIds.followersClean;

                return result;
            }
        );

        res.json({
            status: "success",
            follows: follows.docs,
            user_following: follows.following,
            users_follow_me: follows.followers,
            page: follows.page,
            itemsPerPage: follows.limit,
            total: follows.totalDocs,
            pages: follows.totalPages,
        });
    } catch (e) {
        return res.status(404).json({
            status: "error",
            message: e.message,
        });
    }
};
