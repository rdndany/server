const mongoose = require("mongoose");

const projectsSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  symbol: {
    type: String,
    default: "",
  },
  logo: {
    type: String,
    default: "",
  },
  presale: {
    type: Boolean,
    default: "",
  },
  fairlaunch: {
    type: Boolean,
    default: "",
  },
  score: {
    type: Number,
    default: "",
  },
  audits: {
    type: Number,
    default: "",
  },
  audit: {
    type: Boolean,
    default: "",
  },
  kyc: {
    type: Boolean,
    default: "",
  },
  network: {
    type: Number,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  priceUsd: {
    type: Number,
    default: "",
  },
  priceUsd24hAgo: {
    type: Number,
    default: "",
  },
  priceUsd7dAgo: {
    type: Number,
    default: "",
  },
  marketCapUsd: {
    type: Number,
    default: "",
  },
  trades24h: {
    type: Number,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
});

const Projects = mongoose.model("Projects", projectsSchema);
module.exports = Projects;
