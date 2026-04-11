const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { getAdminPanel, getDashboard } = require("../controllers/protectedController");

const router = express.Router();

router.get("/", requireAuth, getDashboard);
router.get("/admin", requireAuth, getAdminPanel);

module.exports = router;
