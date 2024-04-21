import mongoose from "mongoose"

try {
    await mongoose.connect("mongodb://localhost:27017/social_media");
} catch (e) {
    console.error(e)
}
