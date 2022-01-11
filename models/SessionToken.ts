import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SessionTokenSchema = new Schema({
    uid: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    issuedAt: {
        type: Date,
        required: true,
    },
    appSource: {
        type: String,
        enum: ["web", "mobile"],
        required: true,
    },
    uidAppSource: {
        type: String,
        required: true,
        index: {
            unique: true,
            dropDups: true,
        },
    },
});

SessionTokenSchema.pre("save", function (next) {
    this.uidAppSource = `${this.uid}:${this.appSource}`;
    next();
});

// mongoose.models = {};

const SessionToken =
          mongoose.models.SessionToken ||
          mongoose.model("SessionToken", SessionTokenSchema);
export default SessionToken;
