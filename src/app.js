require("dotenv").config();

const express = require("express");
const { sessionMiddleware } = require("./middleware/session");
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/homeRoute");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(sessionMiddleware());
app.use("/", authRouter);
app.use("/", homeRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
