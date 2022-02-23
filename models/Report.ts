import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    emitter: {
        type: Object,
    },
    document: {
        type: Object,
        default : null
    },
    context: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: [
            "user",
            "resource"
        ],
    },
    validated: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// mongoose.models = {};

const Report =
          mongoose.models.Report ||
          mongoose.model("Report", reportSchema);
export default Report;
