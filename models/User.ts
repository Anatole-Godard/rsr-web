import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photoURL: {
    type: String,
    default:
      "/uploads/user/default.png", // TODO: must depends on ourselves
  },
});


const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
