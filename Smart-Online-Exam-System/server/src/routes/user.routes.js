const express = require("express");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
    profile,
    updateProfile,
    adminDashboard,
} = require("../controllers/user.controller");

const router = express.Router();

router.get(
    "/profile",
    auth,
    profile
);

router.patch(
  "/profile",
  auth,
  updateProfile
);

router.get(
    "/admin",
    auth,
    authorize("ADMIN"),
    adminDashboard
);

module.exports = router;