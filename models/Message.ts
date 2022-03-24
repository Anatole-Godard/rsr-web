import mongoose from "mongoose";
const Schema = mongoose.Schema;

const message = new Schema({
    user: {
        type: Object,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// mongoose.models = {};

const Message = mongoose.models.Message || mongoose.model("Message", message);
export default Message;
