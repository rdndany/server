const express = require("express");
const router = express.Router();
const {
  getProjects,
  addProject,
  getSearchProjects,
  getProjectsPrices,
} = require("../controllers/projectsController");

router.get("/", getProjects);
router.post("/", addProject);
router.post("/search", getSearchProjects);
router.get("/prices", getProjectsPrices);

module.exports = router;
