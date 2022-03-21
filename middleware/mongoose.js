import mongoose from "mongoose";

/**
 * If the database is already connected, use the current connection. Otherwise, connect to the database
 * and use that connection
 * @param handler - The handler function that will be called after the connection is made.
 * @returns A function that takes in a request and a response.
 */
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
