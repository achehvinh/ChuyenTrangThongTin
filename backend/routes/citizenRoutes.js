const express = require("express");
const router = express.Router();

const { createCitizen } = require("../controllers/citizenController");

router.post("/", createCitizen);

module.exports = router;