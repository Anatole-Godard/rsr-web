import mongoose from "mongoose";
const Schema = mongoose.Schema;

const logSchema = new Schema({
  user: {
    type: Object,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: ["fetch", "next"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// mongoose.models = {};

const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
export default Log;
