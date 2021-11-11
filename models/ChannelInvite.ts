import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ChannelInviteSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  channelSlug: {
    type: String,
    required: true,
  },
  expirationType: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: String,
  },
  maxUses: {
    type: Number,
  },
});

// mongoose.models = {};

const ChannelInvite =
  mongoose.models.ChannelInvite ||
  mongoose.model("ChannelInvite", ChannelInviteSchema);
export default ChannelInvite;
