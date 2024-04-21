import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        surname: String,
        bio: String,
        nick: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "role_user",
        },
        image: {
            type: String,
            default: "default.png",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(paginate);

export default mongoose.model("User", userSchema);
