import connectDB from "@middleware/mongoose";
import User from "@models/user";

const handler = async (req, res) => {
//   return res.json({
//     url: `mongodb+srv://${process.env.DB_USER || "root"}:${
//       process.env.DB_PASS || "root"
//     }@${process.env.DB_HOST || "mongo:27017"}/${
//       process.env.DB_NAME || "rsr"
//     }?retryWrites=true&w=majority`,
//   });
  if (req.method === "POST") {
    const user = new User({
      fullName: "John Doe",
      email: "john.doe@mail.fr",
      password: "A",
      birthDate: new Date("2000-01-01"),
    });
    // Create new user
    var usercreated = await user.save();
    res.status(200).json({
      created: usercreated,
    });
  } else {
    res.status(200).json({
      users: await User.find({}),
    });
  }
};

export default connectDB(handler);

// export default handler;
