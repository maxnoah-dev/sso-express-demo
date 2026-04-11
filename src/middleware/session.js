const session = require("express-session");

function getSessionSecret() {
  const fromEnv = process.env.SESSION_SECRET;
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production");
  }
  console.warn(
    "[session] SESSION_SECRET chưa set — dùng secret mặc định chỉ cho dev"
  );
  return "sso-demo-dev-only-khong-dung-production";
}

function sessionMiddleware() {
  return session({
    secret: getSessionSecret(),
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false /* true nếu HTTPS */ },
  });
}

module.exports = { sessionMiddleware };
