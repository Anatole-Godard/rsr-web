import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
  owner: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
  },
  members: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resources: {
    type: Array,
  },
  photoURL: {
    type: String,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  description: {
    type: String,
  },
});


const Channel =
  mongoose.models.Channel || mongoose.model("Channel", ChannelSchema);
export default Channel;
