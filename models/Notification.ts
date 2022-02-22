import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user: {
    type: Object,
    required: true,
  },
  emitter: {
    type: Object,
  },
  document: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "comment",
      "mention",
      "like",
      "message",
      "resource_create",
      "invite",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// mongoose.models = {};

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
export default Notification;
