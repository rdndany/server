const asyncHandler = require("express-async-handler");
const Projects = require("../models/projectsModel");
const mongoose = require("mongoose");
const axios = require("axios");

const getProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  console.log(limit);
  try {
    // Fetch total count of projects
    const totalCount = await Projects.countDocuments();

    // Fetch projects for the specified page and limit
    const projects = await Projects.find({}).skip(skip).limit(limit).exec();

    if (projects.length === 0) {
      console.log("No projects found in the database");
    }

    // Calculate the sum of marketCapUsd
    const totalMarketCapUsd = projects.reduce(
      (acc, project) => acc + (project.marketCapUsd || 0),
      0
    );

    res.status(200).json({
      projects,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      limit,
      totalMarketCapUsd,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const addProject = asyncHandler(async (req, res) => {
  const project = req.body;
  try {
    var newProject = await Projects.create(project);
    if (newProject) {
      res.status(200).json(newProject);
    } else {
      res.status(400);
      throw new Error("Invalid project");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving data" });
  }
});

const getProjectsPrices = asyncHandler(async (req, res) => {
  let allProjects = await Projects.find({});

  const projects = {};

  allProjects.forEach((project) => {
    const { network, address } = project;

    // Determine the network code

    // Check if the network code is defined
    if (network !== undefined) {
      // Initialize the array for the network code if it doesn't exist
      if (!projects[network]) {
        projects[network] = [];
      }

      // Add the address to the array corresponding to the network code
      projects[network].push(address);
    }
  });

  const requestOptions = {
    method: "POST",
    url: `https://api.coinbrain.com/public/coin-info`,
    data: projects,
  };

  try {
    const response = await axios.request(requestOptions);
    const data = response.data;

    // Log the received data for debugging
    console.log("API Response:", data);

    // Iterate through the received data and update your database
    for (const entry of data) {
      const {
        address,
        priceUsd,
        priceUsd24hAgo,
        priceUsd7dAgo,
        marketCapUsd,
        trades24h,
      } = entry;
      // Update documents in the 'Projects' collection based on address
      const result = await Projects.updateMany(
        { address: { $regex: new RegExp("^" + address + "$", "i") } },
        {
          $set: {
            priceUsd,
            priceUsd24hAgo,
            priceUsd7dAgo,
            marketCapUsd,
            trades24h,
          },
        }
      );

      // Log the result for debugging
      console.log(
        `Updated ${result.nModified} documents for address: ${address}`
      );
      console.log("Update Result:", result);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("API Request Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getSearchProjects = asyncHandler(async (req, res) => {
  const searchTerm = req.body.searchTerm;
  console.log(req.body);
  let projects = await Projects.find();
  if (searchTerm) {
    projects = projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }
  res.status(200).json({
    projects,
  });
});

module.exports = {
  getProjects,
  addProject,
  getSearchProjects,
  getProjectsPrices,
};
