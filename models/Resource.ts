import mongoose from "mongoose";
const Schema = mongoose.Schema;

const resource = new Schema({
  slug: {
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
  description: {
    type: String,
    required: false,
  },
  tags: {
    type: Array,
    required: false,
  },
  data: {
    type: Object,
    required: true,
  },
  likes: {
    type: Array,
    required: true,
    default: [],
  },
  comments: {
    type: Array,
    default: [],
  },
  validated: {
    type: Boolean,
    default: false,
  },
});

// mongoose.models = {};

const Resource = mongoose.model("Resource", resource);

export default Resource;
