const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const { authConfig } = require("../config/auth");

const jwks = jwksClient({ jwksUri: authConfig.idp.jwksUri, cache: true });

function getSigningKey(header) {
  return new Promise((resolve, reject) => {
    jwks.getSigningKey(header.kid, (err, key) => {
      if (err) return reject(err);
      resolve(key.getPublicKey());
    });
  });
}

async function verifyToken(token) {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error("Invalid ID token");
  }
  const publicKey = await getSigningKey(decoded.header);

  return jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
    issuer: authConfig.idp.issuer,
    audience: authConfig.client.clientId,
  });
}

module.exports = { getSigningKey, verifyToken };
