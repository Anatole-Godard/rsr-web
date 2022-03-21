import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  validated: {
    type: Boolean,
    default: true,
  },
});

// mongoose.models = {};

const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema);
export default Tag;
