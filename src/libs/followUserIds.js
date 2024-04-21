import Follow from "../models/follow.model.js";

export const followUserIds = async (identityUserId) => {
    let following = await Follow.find({ user: identityUserId }).select(
        "followed -_id"
    );

    let followers = await Follow.find({ followed: identityUserId }).select(
        "user -_id"
    );

    let followingClean = [];
    let followersClean = [];

    following.forEach((follow) => {
        followingClean.push(follow.followed);
    });

    followers.forEach((follow) => {
        followersClean.push(follow.user);
    });

    return {
        followingClean,
        followersClean,
    };
};

export const followThisUser = async (identityUserId, profileUserId) => {
    let following = await Follow.findOne({
        user: identityUserId,
        followed: profileUserId,
    });

    let follower = await Follow.findOne({
        user: profileUserId,
        followed: identityUserId,
    });

    return {
        following,
        follower,
    };
};
