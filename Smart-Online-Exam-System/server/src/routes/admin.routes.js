const express = require("express");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getDashboard,
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

module.exports = router;