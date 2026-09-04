const WaterReport = require('../models/WaterReport');
const { getMongoStatus, memoryStore } = require('../config/db');

// @desc    Get all water shortage reports
// @route   GET /api/water-reports
const getAllReports = async (req, res, next) => {
  try {
    if (getMongoStatus()) {
      const reports = await WaterReport.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: reports.length, data: reports });
    } else {
      return res.status(200).json({ success: true, count: memoryStore.waterReports.length, data: memoryStore.waterReports });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or update shortage report status
// @route   PATCH /api/water-reports/:id/verify
const verifyReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    const validStatuses = ['Pending', 'Verified', 'Assigned', 'Resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (getMongoStatus()) {
      const updateFields = {};
      if (status) updateFields.status = status;
      if (priority) updateFields.priority = priority;

      const report = await WaterReport.findByIdAndUpdate(id, updateFields, { new: true });
      if (!report) {
        return res.status(404).json({ success: false, message: `Report ${id} not found.` });
      }
      return res.status(200).json({ success: true, data: report });
    } else {
      const report = memoryStore.waterReports.find(r => r._id === id);
      if (!report) {
        return res.status(404).json({ success: false, message: `Report ${id} not found.` });
      }
      if (status) report.status = status;
      if (priority) report.priority = priority;
      return res.status(200).json({ success: true, data: report });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllReports, verifyReport };

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
