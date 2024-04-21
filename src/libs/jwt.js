import jwt from "jsonwebtoken";
import moment from "moment";

export const createAccessToken = async (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix(),
    };

    try {
        const token = jwt.sign(payload, process.env.SECRET_KEY);

        return token;
    } catch (e) {
        console.log(e);
    }
};
