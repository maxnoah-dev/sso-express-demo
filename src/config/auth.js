const authConfig = {
  idp: {
    issuer: "https://keycloak.bank.com/realms/banking",
    authorizationEndpoint:
      "https://keycloak.bank.com/realms/banking/protocol/openid-connect/auth",
    tokenEndpoint:
      "https://keycloak.bank.com/realms/banking/protocol/openid-connect/token",
    jwksUri:
      "https://keycloak.bank.com/realms/banking/protocol/openid-connect/certs",
    endSessionEndpoint:
      "https://keycloak.bank.com/realms/banking/protocol/openid-connect/logout",
  },
  client: {
    clientId: "internet-banking-app",
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: "http://localhost:3000/callback",
    scopes: ["openid", "profile", "email", "accounts:read"],
  },
  postLogoutRedirectUri: "http://localhost:3000",
};

module.exports = { authConfig };
