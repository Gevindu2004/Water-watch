const WaterReport = require('../models/WaterReport');

exports.createReport = async (req, res) => {
  try {
    const newReport = new WaterReport(req.body);
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVillageReports = async (req, res) => {
  try {
    const reports = await WaterReport.find({ village: req.params.villageId })
                                     .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
