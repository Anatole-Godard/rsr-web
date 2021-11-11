import connectDB from "@middleware/mongoose";
import User from "@models/user";

// const bcrypt = require("bcrypt");

const handler = async (req, res) => {
  if (req.method === "POST") {
    const user = new User({
      fullName: "John Doe",
      email: "john.doe@mail.fr",
      password: "A", //await bcrypt.hash("A", 10),
      birthDate: new Date("2000-01-01"),
    });
    try {
      // Create new user
      var usercreated = await user.save();
      res.status(200).json({
        created: usercreated,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  } else {
    res.status(200).json({
      users: await User.find({}),
    });
  }
};

export default connectDB(handler);
