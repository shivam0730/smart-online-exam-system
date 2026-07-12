const express = require("express");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getDashboard,
  getUsers,
  updateUserStatus,
} = require("../controllers/admin.controller");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication & Authorization
|--------------------------------------------------------------------------
*/

router.use(auth);
router.use(authorize("ADMIN", "SUPER_ADMIN"));

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  getDashboard
);

router.get(
  "/users",
  getUsers
);

router.patch(
  "/users/:userId/status",
  updateUserStatus
);

module.exports = router;