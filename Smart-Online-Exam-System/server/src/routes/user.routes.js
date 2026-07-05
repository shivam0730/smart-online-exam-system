const express = require("express");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
    profile,
    adminDashboard,
} = require("../controllers/user.controller");

const router = express.Router();

router.get(
    "/profile",
    auth,
    profile
);

router.get(
    "/admin",
    auth,
    authorize("ADMIN"),
    adminDashboard
);

module.exports = router;