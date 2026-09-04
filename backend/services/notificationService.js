const Bowser = require('../models/Bowser');
const DeliveryLog = require('../models/DeliveryLog');
const ResidentNotification = require('../models/ResidentNotification');
const ShortageReport = require('../models/ShortageReport');

/**
 * Handles official approval and dispatch execution
 */
async function dispatchBowser({
  villageId,
  villageName,
  bowserId,
  capacity,
  approvedBy = 'Regional Water Authority Officer',
  targetEta = '2:15 PM'
}) {
  // 1. Update Bowser state
  await Bowser.updateBowser(bowserId, {
    status: 'dispatched',
    assignedVillageId: villageId
  });

  // 2. Create Delivery Log entry
  const deliveryLog = await DeliveryLog.createLog({
    deliveryId: `DLV-${Date.now().toString().slice(-6)}`,
    villageId,
    villageName,
    bowserId,
    capacityDelivered: capacity,
    status: 'dispatched',
    approvedBy,
    targetEta
  });

  // 3. Mark Shortage Report status as dispatched
  await ShortageReport.updateReport(villageId, {
    status: 'dispatched'
  });

  // 4. Generate and broadcast resident notification
  const residentAlert = await ResidentNotification.createNotification({
    notificationId: `NOTIF-${Date.now().toString().slice(-6)}`,
    villageId,
    villageName,
    title: `🚨 Emergency Water Bowser Dispatched: ${bowserId}`,
    message: `Water Bowser ${bowserId} (${capacity.toLocaleString()} L) has been officially approved and is now en route to ${villageName}. Estimated arrival time is ${targetEta}. Please assemble at designated community distribution points with clean containers.`,
    channel: 'SMS / Resident Mobile App / Community Loudspeaker',
    type: 'dispatch',
    bowserId,
    eta: targetEta
  });

  return {
    success: true,
    message: `Bowser ${bowserId} successfully dispatched to ${villageName}. Resident broadcast sent.`,
    deliveryLog,
    residentAlert
  };
}

/**
 * Get all resident notifications
 */
async function getResidentNotifications(villageId = null) {
  const filter = villageId ? { villageId } : {};
  return ResidentNotification.findNotifications(filter);
}

module.exports = {
  dispatchBowser,
  getResidentNotifications
};
