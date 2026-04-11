function getDashboard(req, res) {
  res.json({
    message: "Chào mừng vào Internet Banking",
    user: req.session.user,
  });
}

function getAdminPanel(req, res) {
  const user = req.session.user;
  const roles =
    user && user.roles ? user.roles : [];
  if (!roles.includes("bank-admin")) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.json({ message: "Admin panel" });
}

module.exports = { getDashboard, getAdminPanel };
