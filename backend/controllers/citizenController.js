const Citizen = require("../models/Citizen");

const createCitizen = async (req, res) => {
  try {
    const citizen = await Citizen.create(req.body);
    res.status(201).json(citizen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCitizen,
};