import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const followSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        followed: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

followSchema.plugin(paginate);

export default mongoose.model("Follow", followSchema, "follows");
