const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { getAdminPanel, getHomePage } = require("../controllers/homeController");

const router = express.Router();

router.get("/", requireAuth, getHomePage);
router.get("/admin", requireAuth, getAdminPanel);

module.exports = router;
