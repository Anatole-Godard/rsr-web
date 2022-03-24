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
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  messages: {
    type: Array,
    default: [],
  },
  activities: {
    type: Array,
    default: [],
  },
  members: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  image: {
    type: Object,
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
