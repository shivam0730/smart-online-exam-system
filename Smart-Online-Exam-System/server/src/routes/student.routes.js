const express = require("express");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
    profile,
    dashboard,
} = require("../controllers/student.controller");

const router = express.Router();

router.use(auth);

router.use(authorize("STUDENT"));

router.get(
    "/profile",
    profile
);

router.get(
    "/dashboard",
    dashboard
);

module.exports = router;