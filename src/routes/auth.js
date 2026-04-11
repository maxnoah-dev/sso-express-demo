const express = require("express");
const crypto = require("crypto");
const { authConfig } = require("../config/auth");
const { verifyToken } = require("../lib/jwt");

const router = express.Router();

router.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const nonce = crypto.randomBytes(16).toString("hex");

  req.session.oauthState = state;
  req.session.oauthNonce = nonce;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: authConfig.client.clientId,
    redirect_uri: authConfig.client.redirectUri,
    scope: authConfig.client.scopes.join(" "),
    state,
    nonce,
  });

  res.redirect(`${authConfig.idp.authorizationEndpoint}?${params}`);
});

router.get("/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) return res.status(400).json({ error });

  if (state !== req.session.oauthState) {
    return res
      .status(400)
      .json({ error: "Invalid state — possible CSRF attack" });
  }

  const tokenResponse = await fetch(authConfig.idp.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: authConfig.client.redirectUri,
      client_id: authConfig.client.clientId,
      client_secret: authConfig.client.clientSecret,
    }),
  });

  const tokens = await tokenResponse.json();
  if (tokens.error) return res.status(400).json(tokens);

  let claims;
  try {
    claims = await verifyToken(tokens.id_token);
  } catch (e) {
    return res
      .status(400)
      .json({ error: "Invalid ID token", detail: String(e) });
  }

  if (claims.nonce !== req.session.oauthNonce) {
    return res.status(400).json({ error: "Invalid nonce" });
  }

  req.session.user = {
    sub: claims.sub,
    name: claims.name,
    email: claims.email,
    roles:
      claims.realm_access && claims.realm_access.roles
        ? claims.realm_access.roles
        : [],
  };
  req.session.accessToken = tokens.access_token;

  delete req.session.oauthState;
  delete req.session.oauthNonce;

  res.redirect(req.session.returnTo != null ? req.session.returnTo : "/");
});

router.get("/logout", (req, res) => {
  const idpLogoutParams = new URLSearchParams({
    post_logout_redirect_uri: authConfig.postLogoutRedirectUri,
    client_id: authConfig.client.clientId,
  });

  req.session.destroy(() => {
    res.redirect(
      `${authConfig.idp.endSessionEndpoint}?${idpLogoutParams}`
    );
  });
});

module.exports = router;
