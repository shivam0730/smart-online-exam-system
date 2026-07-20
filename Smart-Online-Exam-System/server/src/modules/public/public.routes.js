const express = require("express");

const publicController = require("./public.controller");

const router = express.Router();

router.get("/home", publicController.getHomeData);

module.exports = router;