# WaterWatch Polonnaruwa - Component 2 API Documentation

## 🚛 Bowser & Water Delivery Management Service

This component handles water bowser fleet management, scheduling water deliveries to drought-affected villages, tracking delivery status, and providing live resident waiting queue updates.

---

## 📡 Base URL
`http://localhost:5000/api`

---

## 1. Bowser Management APIs (`/api/bowsers`)

### 🔹 Get All Bowsers
- **Endpoint**: `GET /api/bowsers`
- **Response**: `200 OK`
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "bowser-102",
      "bowserId": "WB-102",
      "registrationNumber": "WP CP-4821",
      "capacity": 5000,
      "currentLocation": "Polonnaruwa Depot",
      "status": "Available",
      "driverName": "Sarath Kumara",
      "driverContact": "+94 77 123 4567"
    }
  ]
}
```

### 🔹 Add Bowser
- **Endpoint**: `POST /api/bowsers`
- **Body**:
```json
{
  "bowserId": "WB-115",
  "registrationNumber": "WP CP-9988",
  "capacity": 5000,
  "currentLocation": "Medirigiriya Water Depot",
  "status": "Available",
  "driverName": "K. Silva",
  "driverContact": "+94 77 999 8888"
}
```
- **Response**: `201 Created`

### 🔹 Update Bowser Details
- **Endpoint**: `PUT /api/bowsers/:id`
- **Body**: Any Bowser fields to update
- **Response**: `200 OK`

### 🔹 Update Bowser Status
- **Endpoint**: `PATCH /api/bowsers/:id/status`
- **Body**:
```json
{
  "status": "On The Way",
  "currentLocation": "En route to Siripura"
}
```
- **Allowed Statuses**: `Available`, `Assigned`, `On The Way`, `Distributing`, `Completed`, `Delayed`

---

## 2. Delivery Management APIs (`/api/deliveries`)

### 🔹 Get All Deliveries
- **Endpoint**: `GET /api/deliveries`
- **Response**: `200 OK`

### 🔹 Schedule New Water Delivery
- **Endpoint**: `POST /api/deliveries`
- **Body**:
```json
{
  "bowserId": "WB-102",
  "villageId": "Siripura",
  "distributionPoint": "Siripura Temple Junction",
  "scheduledDate": "2026-09-04",
  "estimatedArrival": "2:00 PM",
  "capacity": 5000,
  "peopleWaiting": 86
}
```
- **Response**: `201 Created`

### 🔹 Update Delivery Status
- **Endpoint**: `PATCH /api/deliveries/:id/status`
- **Body**:
```json
{
  "status": "On The Way"
}
```
- **Allowed Statuses**: `Scheduled`, `On The Way`, `Distributing`, `Completed`, `Delayed`

### 🔹 Get Deliveries for a Specific Village (Member 1 Resident Portal Integration)
- **Endpoint**: `GET /api/deliveries/village/:villageId`
- **Example**: `GET /api/deliveries/village/Siripura`
- **Response**: `200 OK`
```json
{
  "success": true,
  "village": "Siripura",
  "count": 1,
  "data": [
    {
      "_id": "del-201",
      "bowserId": "WB-102",
      "villageId": "Siripura",
      "distributionPoint": "Siripura Temple Junction",
      "scheduledDate": "2026-09-04",
      "estimatedArrival": "2:00 PM",
      "capacity": 5000,
      "status": "Scheduled",
      "peopleWaiting": 86
    }
  ]
}
```

### 🔹 Update Resident Queue / People Waiting
- **Endpoint**: `PATCH /api/deliveries/:id/queue`
- **Body Options**:
  - Incremental: `{ "action": "increment" }`
  - Decremental: `{ "action": "decrement" }`
  - Explicit count: `{ "peopleWaiting": 87 }`
- **Response**: `200 OK`

---

## 💡 Demo Scenario Guide
1. Check `WB-102` availability via `GET /api/bowsers`.
2. Schedule a delivery for **Siripura** at 2:00 PM with `WB-102` (`POST /api/deliveries`).
3. Observe delivery listed under `Scheduled`.
4. Update delivery status to `On The Way` (`PATCH /api/deliveries/:id/status`).
5. Residents hit `PATCH /api/deliveries/:id/queue` with `{ "action": "increment" }` to join queue (e.g. queue increases to 87, ~57.4 L/person).
6. Complete distribution (`PATCH /api/deliveries/:id/status` -> `Completed`).
