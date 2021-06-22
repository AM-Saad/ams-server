const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        site_description:String,
        active: Boolean,
        title: String,
        subtitle: String,
        brief: String,
        image: String,
        client: String,
        status: String,
        demo: String,
        reactions: {
            clab: Number,
            love: Number,
            like: Number,
        },
        shares: [],
        tags: [],
        category: { name: String, sub: String },
        content: [{
            id: String,
            name: String,
            text: String,
            image: String
        }],
        date: String,
        time: String,

    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
