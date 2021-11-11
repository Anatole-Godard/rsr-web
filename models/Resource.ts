import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
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


const Resource = mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);

export default Resource;