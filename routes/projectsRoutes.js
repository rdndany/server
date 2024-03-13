const express = require("express");
const router = express.Router();
const {
  getProjects,
  addProject,
  getSearchProjects,
  getProjectsPrices,
  getProjectsByHandle,
} = require("../controllers/projectsController");

router.get("/", getProjects);
router.post("/", addProject);
router.post("/search", getSearchProjects);
router.get("/prices", getProjectsPrices);
router.post("/project", getProjectsByHandle);

module.exports = router;
