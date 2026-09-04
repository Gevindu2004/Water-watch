const User = require('../models/User');
const Tank = require('../models/Tank');
const Bowser = require('../models/Bowser');
const Delivery = require('../models/Delivery');
const WaterReport = require('../models/WaterReport');
const { getMongoStatus, memoryStore } = require('../config/db');

// @desc    Get Admin Control Center Dashboard
// @route   GET /api/admin/dashboard
const getAdminDashboard = async (req, res, next) => {
  try {
    if (getMongoStatus()) {
      const tanksCount = await Tank.countDocuments();
      const criticalTanks = await Tank.countDocuments({ status: 'CRITICAL' });
      const activeShortages = await WaterReport.countDocuments({ status: { $in: ['Pending', 'Verified'] } });
      const activeBowsers = await Bowser.countDocuments({ status: { $in: ['Available', 'On The Way', 'Distributing'] } });
      const todaysDeliveries = await Delivery.countDocuments();
      
      const criticalTanksList = await Tank.find({ status: 'CRITICAL' });
      const recentReports = await WaterReport.find().sort({ createdAt: -1 }).limit(5);
      const activeDeliveriesList = await Delivery.find().sort({ createdAt: -1 }).limit(5);

      return res.status(200).json({
        success: true,
        metrics: {
          tanksMonitored: tanksCount || 4,
          criticalTanks: criticalTanks || 1,
          activeShortages: activeShortages || 8,
          activeBowsers: activeBowsers || 6,
          todaysDeliveries: todaysDeliveries || 12,
          criticalVillages: 2
        },
        criticalTanks: criticalTanksList,
        criticalVillages: [
          { village: 'Siripura', status: 'CRITICAL', daysWithoutWater: 3, affected: 120, tankLevel: '18%' },
          { village: 'Bakamuna', status: 'WARNING', daysWithoutWater: 2, affected: 80, tankLevel: '25%' }
        ],
        activeDeliveries: activeDeliveriesList,
        recentReports
      });
    } else {
      const criticalTanksList = memoryStore.tanks.filter(t => t.status === 'CRITICAL');
      return res.status(200).json({
        success: true,
        metrics: {
          tanksMonitored: memoryStore.tanks.length,
          criticalTanks: criticalTanksList.length,
          activeShortages: memoryStore.waterReports.filter(r => r.status !== 'Resolved').length,
          activeBowsers: memoryStore.bowsers.filter(b => b.status !== 'Completed').length,
          todaysDeliveries: memoryStore.deliveries.length,
          criticalVillages: 2
        },
        criticalTanks: criticalTanksList,
        criticalVillages: [
          { village: 'Siripura', status: 'CRITICAL', daysWithoutWater: 3, affected: 120, tankLevel: '18%' },
          { village: 'Bakamuna', status: 'WARNING', daysWithoutWater: 2, affected: 80, tankLevel: '25%' }
        ],
        activeDeliveries: memoryStore.deliveries,
        recentReports: memoryStore.waterReports
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    if (getMongoStatus()) {
      const users = await User.find().sort({ role: 1 });
      return res.status(200).json({ success: true, count: users.length, data: users });
    } else {
      return res.status(200).json({ success: true, count: memoryStore.users.length, data: memoryStore.users });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (Activate / Deactivate)
// @route   PATCH /api/admin/users/:id/status
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Active or Inactive' });
    }

    if (getMongoStatus()) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      // Guard: Do not allow deactivating the final active administrator
      if (user.role === 'admin' && status === 'Inactive') {
        const activeAdminsCount = await User.countDocuments({ role: 'admin', status: 'Active' });
        if (activeAdminsCount <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Action blocked: Cannot deactivate the final active administrator account.'
          });
        }
      }

      user.status = status;
      await user.save();
      return res.status(200).json({ success: true, data: user });
    } else {
      const user = memoryStore.users.find(u => u._id === id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      // Guard: Check active admins count in memory
      if (user.role === 'admin' && status === 'Inactive') {
        const activeAdminsCount = memoryStore.users.filter(u => u.role === 'admin' && u.status === 'Active').length;
        if (activeAdminsCount <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Action blocked: Cannot deactivate the final active administrator account.'
          });
        }
      }

      user.status = status;
      return res.status(200).json({ success: true, data: user });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['resident', 'officer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be resident, officer, or admin' });
    }

    if (getMongoStatus()) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      // Guard: Do not remove the final admin
      if (user.role === 'admin' && role !== 'admin') {
        const activeAdminsCount = await User.countDocuments({ role: 'admin', status: 'Active' });
        if (activeAdminsCount <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Action blocked: Cannot change role of the final active administrator.'
          });
        }
      }

      user.role = role;
      await user.save();
      return res.status(200).json({ success: true, data: user });
    } else {
      const user = memoryStore.users.find(u => u._id === id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (user.role === 'admin' && role !== 'admin') {
        const activeAdminsCount = memoryStore.users.filter(u => u.role === 'admin' && u.status === 'Active').length;
        if (activeAdminsCount <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Action blocked: Cannot change role of the final active administrator.'
          });
        }
      }

      user.role = role;
      return res.status(200).json({ success: true, data: user });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get System Analytics data for charts
// @route   GET /api/admin/analytics
const getSystemAnalytics = async (req, res, next) => {
  try {
    const analytics = {
      summary: {
        peopleAffected: 1240,
        waterDeliveredLiters: 38500,
        shortagesResolved: 24,
        criticalVillages: 2
      },
      shortagesByVillage: [
        { village: 'Siripura', count: 12, affected: 540, status: 'CRITICAL' },
        { village: 'Bakamuna', count: 8, affected: 320, status: 'WARNING' },
        { village: 'Welikanda', count: 5, affected: 200, status: 'LOW' },
        { village: 'Medirigiriya', count: 6, affected: 180, status: 'WARNING' },
        { village: 'Hingurakgoda', count: 3, affected: 90, status: 'NORMAL' }
      ],
      deliveriesTrend: [
        { day: 'Mon', scheduled: 8, completed: 8, delayed: 0 },
        { day: 'Tue', scheduled: 10, completed: 9, delayed: 1 },
        { day: 'Wed', scheduled: 12, completed: 11, delayed: 1 },
        { day: 'Thu', scheduled: 12, completed: 10, delayed: 2 },
        { day: 'Fri', scheduled: 14, completed: 12, delayed: 2 }
      ],
      tankLevelsOverview: [
        { name: 'Parakrama Samudraya', percentage: 78, status: 'NORMAL' },
        { name: 'Giritale Tank', percentage: 65, status: 'NORMAL' },
        { name: 'Kaudulla Tank', percentage: 35, status: 'WARNING' },
        { name: 'Minneriya Tank', percentage: 18, status: 'CRITICAL' }
      ]
    };

    return res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getSystemAnalytics
};
