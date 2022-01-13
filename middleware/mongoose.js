import mongoose from "mongoose";

const withDatabase = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  
  await mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${
      process.env.DB_HOST
    }/${
      process.env.DB_NAME || "rsr"
    }?retryWrites=true&w=majority&authSource=admin`,

    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );
  return handler(req, res);
};

export default withDatabase;
