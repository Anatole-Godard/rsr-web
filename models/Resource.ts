import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
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
  visibility: {
    type: String,
    required: true,
    default: "public",
    enum: ["public", "private", "unlisted"],
  },
  members: {
    type: Array,
    required: false,
  },
  seenBy: {
    type: Array,
    default: [],
  },
});

const Resource =
  mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);

export default Resource;

ResourceSchema.post("save", function (next) {
  // workaround for passing builds
  (this as unknown as { updatedAt: number }).updatedAt = Date.now();
  next();
});
