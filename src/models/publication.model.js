import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export const publicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        text: {
            type: String,
            required: true,
        },
        file: String,
    },
    {
        timestamps: true,
    }
);

publicationSchema.plugin(paginate);

export default mongoose.model("Publication", publicationSchema, "publications");
