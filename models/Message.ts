import mongoose from "mongoose";
const Schema = mongoose.Schema;

const message = new Schema({
    user: {
        type: Object,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    attachment: {
        type: Object,
        required: false,
    }
});

// mongoose.models = {};

const Message = mongoose.models.Message || mongoose.model("Message", message);
export default Message;
