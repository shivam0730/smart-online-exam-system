const express = require("express");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
    profile,
    dashboard,
} = require("../controllers/teacher.controller");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication & Authorization
|--------------------------------------------------------------------------
*/

router.use(auth);
router.use(authorize("TEACHER"));

/*
|--------------------------------------------------------------------------
| Teacher Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/profile",
    profile
);

router.get(
    "/dashboard",
    dashboard
);

module.exports = router;