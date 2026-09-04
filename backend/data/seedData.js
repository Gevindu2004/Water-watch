// Official seed data for WaterWatch Polonnaruwa
// Represents integration with:
// Member 1: Shortage Reports
// Member 2: Bowsers
// Member 3: Tanks
// Member 4: Delivery History & Resident Notifications

const initialShortageReports = [
  {
    _id: "rep-001",
    villageId: "VIL-001",
    villageName: "Siripura",
    division: "Medirigiriya",
    daysWithoutWater: 3,
    affectedPeople: 120,
    alternativeWaterSource: "none", // 'none' | 'limited' | 'adequate'
    alternativeSourceDetails: "No functional wells or piped supply available",
    status: "active",
    reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    daysSinceLastDelivery: 4
  },
  {
    _id: "rep-002",
    villageId: "VIL-002",
    villageName: "Bakamuna",
    division: "Elahera",
    daysWithoutWater: 2,
    affectedPeople: 80,
    alternativeWaterSource: "limited",
    alternativeSourceDetails: "1 brackish agricultural tube well (high salinity)",
    status: "active",
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysSinceLastDelivery: 2
  },
  {
    _id: "rep-003",
    villageId: "VIL-003",
    villageName: "Welikanda",
    division: "Welikanda",
    daysWithoutWater: 1,
    affectedPeople: 200,
    alternativeWaterSource: "limited",
    alternativeSourceDetails: "Irrigation canal 2km away (unfiltered/turbid)",
    status: "active",
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysSinceLastDelivery: 1
  },
  {
    _id: "rep-004",
    villageId: "VIL-004",
    villageName: "Medirigiriya",
    division: "Medirigiriya",
    daysWithoutWater: 4,
    affectedPeople: 60,
    alternativeWaterSource: "none",
    alternativeSourceDetails: "Groundwater depleted; nearby dug wells dry",
    status: "active",
    reportedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    daysSinceLastDelivery: 5
  },
  {
    _id: "rep-005",
    villageId: "VIL-005",
    villageName: "Dimbulagala",
    division: "Dimbulagala",
    daysWithoutWater: 2,
    affectedPeople: 150,
    alternativeWaterSource: "none",
    alternativeSourceDetails: "Remote settlement with dried community pond",
    status: "active",
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysSinceLastDelivery: 3
  }
];

const initialTanks = [
  {
    _id: "tnk-101",
    tankId: "TNK-101",
    tankName: "Siripura Wewa Feeder",
    villageId: "VIL-001",
    villageName: "Siripura",
    waterLevelPercentage: 18, // Critically low!
    capacityLiters: 150000,
    currentVolumeLiters: 27000,
    status: "critical",
    lastUpdated: new Date().toISOString()
  },
  {
    _id: "tnk-102",
    tankId: "TNK-102",
    tankName: "Bakamuna Rural Reservoir",
    villageId: "VIL-002",
    villageName: "Bakamuna",
    waterLevelPercentage: 25,
    capacityLiters: 200000,
    currentVolumeLiters: 50000,
    status: "warning",
    lastUpdated: new Date().toISOString()
  },
  {
    _id: "tnk-103",
    tankId: "TNK-103",
    tankName: "Welikanda East Tank",
    villageId: "VIL-003",
    villageName: "Welikanda",
    waterLevelPercentage: 42,
    capacityLiters: 250000,
    currentVolumeLiters: 105000,
    status: "moderate",
    lastUpdated: new Date().toISOString()
  },
  {
    _id: "tnk-104",
    tankId: "TNK-104",
    tankName: "Medirigiriya Sub-channel Tank",
    villageId: "VIL-004",
    villageName: "Medirigiriya",
    waterLevelPercentage: 30,
    capacityLiters: 180000,
    currentVolumeLiters: 54000,
    status: "warning",
    lastUpdated: new Date().toISOString()
  },
  {
    _id: "tnk-105",
    tankId: "TNK-105",
    tankName: "Dimbulagala Community Tank",
    villageId: "VIL-005",
    villageName: "Dimbulagala",
    waterLevelPercentage: 35,
    capacityLiters: 160000,
    currentVolumeLiters: 56000,
    status: "warning",
    lastUpdated: new Date().toISOString()
  }
];

const initialBowsers = [
  {
    _id: "bw-102",
    bowserId: "WB-102",
    driverName: "Sunil Jayawardena",
    driverPhone: "+94 77 123 4567",
    capacityLiters: 5000,
    currentLocation: "Polonnaruwa Central Depot",
    status: "available", // 'available' | 'dispatched' | 'maintenance'
    etaMinutes: 25,
    estimatedArrivalTime: "2:15 PM",
    assignedVillageId: null,
    licensePlate: "WP-ND-8492"
  },
  {
    _id: "bw-101",
    bowserId: "WB-101",
    driverName: "Kamal Perera",
    driverPhone: "+94 71 987 6543",
    capacityLiters: 3500,
    currentLocation: "Hingurakgoda Station",
    status: "available",
    etaMinutes: 45,
    estimatedArrivalTime: "3:00 PM",
    assignedVillageId: null,
    licensePlate: "WP-NA-3109"
  },
  {
    _id: "bw-103",
    bowserId: "WB-103",
    driverName: "Nimal Fernando",
    driverPhone: "+94 76 555 4321",
    capacityLiters: 9000,
    currentLocation: "Minneriya Depot",
    status: "available",
    etaMinutes: 60,
    estimatedArrivalTime: "3:45 PM",
    assignedVillageId: null,
    licensePlate: "WP-NE-9041"
  }
];

const initialDeliveryLogs = [
  {
    _id: "del-001",
    deliveryId: "DLV-20260901-01",
    villageId: "VIL-001",
    villageName: "Siripura",
    bowserId: "WB-101",
    capacityDelivered: 3500,
    dispatchedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    approvedBy: "Regional Officer M. Bandara"
  },
  {
    _id: "del-002",
    deliveryId: "DLV-20260902-02",
    villageId: "VIL-004",
    villageName: "Medirigiriya",
    bowserId: "WB-102",
    capacityDelivered: 5000,
    dispatchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    approvedBy: "Regional Officer M. Bandara"
  }
];

const initialResidentNotifications = [
  {
    _id: "notif-001",
    notificationId: "NOTIF-001",
    villageId: "VIL-001",
    villageName: "Siripura",
    title: "Scheduled Maintenance Notice",
    message: "Water delivery cycle in progress. Shortage alert recorded for Siripura.",
    channel: "SMS / Resident Mobile App",
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    type: "info"
  }
];

module.exports = {
  initialShortageReports,
  initialTanks,
  initialBowsers,
  initialDeliveryLogs,
  initialResidentNotifications
};
