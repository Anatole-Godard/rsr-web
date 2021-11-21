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
      "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1", // TODO: must depends on ourselves
  },
});


UserSchema.post("findOne", function (doc) {
  if (doc) {
    // doc.password = undefined;
    doc.uid = doc._id.toString();
  }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
