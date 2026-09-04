# WaterWatch Polonnaruwa

## Smart Community Water Coordination and Emergency Water Allocation

WaterWatch is a MERN-style web application for coordinating community water
shortage reporting, water-bowser operations, delivery scheduling, tank
monitoring, and explainable priority recommendations.

The project is designed for drought and reduced-water-availability situations
in Polonnaruwa. It connects residents, water-supply officers, and
administrators through one platform so that available water can be allocated
more transparently and efficiently.

> WaterWatch does not create more water. It helps make sure available water
> reaches the people who need it most.

## Contents

- [Problem and solution](#problem-and-solution)
- [Features](#features)
- [User roles](#user-roles)
- [Application workflow](#application-workflow)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Installation and local development](#installation-and-local-development)
- [Configuration](#configuration)
- [Demo accounts](#demo-accounts)
- [API reference](#api-reference)
- [Data model](#data-model)
- [Priority engine](#priority-engine)
- [Security](#security)
- [Seeding demo data](#seeding-demo-data)
- [Troubleshooting](#troubleshooting)
- [Project scope and future work](#project-scope-and-future-work)
- [Team responsibilities](#team-responsibilities)

## Problem and solution

During a water shortage, residents may not know:

- When the next water bowser will arrive
- Where water will be distributed
- Whether their village has been identified as a shortage area
- How many people are waiting
- Whether nearby tanks have sufficient water
- Whether a delivery has been delayed

Officers may also lack a central view of affected communities, reports,
available bowsers, deliveries, and water resources.

WaterWatch provides a common workflow:

```text
Resident reports shortage
        -> system stores and analyzes the report
        -> officials see affected communities and priorities
        -> an available bowser is recommended
        -> an authorized officer reviews and schedules delivery
        -> residents see the delivery and queue information
        -> distribution is completed and the incident can be resolved
```

## Features

### Resident portal

- Register and log in
- Select or identify a village
- View current village water status
- View days without water, affected population, and tank level
- View upcoming deliveries and distribution points
- View bowser capacity, ETA, status, and people waiting
- Submit water-shortage reports
- View report history and report status
- Join or update a delivery queue

### Water-shortage reporting

Reports can contain:

- Village
- Whether water is available
- Date water was last received
- Number of people affected
- Description
- Report status
- Priority
- Report date

Report status follows this lifecycle:

```text
Pending -> Verified -> Assigned -> Resolved
```

### Water-bowser management

Officers can view, add, edit, delete, and update bowsers. A bowser includes:

- Bowser ID
- Registration number
- Capacity in litres
- Current location
- Driver name and contact
- Current status

Supported statuses include `Available`, `Assigned`, `On The Way`,
`Distributing`, `Completed`, and `Delayed`.

### Delivery scheduling

Officers can schedule deliveries containing:

- Bowser
- Village
- Distribution point
- Scheduled date
- Estimated arrival time
- Capacity
- Delivery status
- People waiting

Residents can view village deliveries without contacting the water office
directly.

### Community queue

Residents can indicate attendance at a delivery. The queue supports
incrementing, decrementing, setting an explicit count, and applying a numeric
change. This gives officers an estimate of expected demand before
distribution.

### Tank and water-resource monitoring

Administrators can monitor tanks and reservoirs, including:

- Tank name and location
- Total capacity
- Current level and percentage
- Status
- Last update
- Historical levels
- Nearby villages

The intended water-level categories are:

| Level | Status |
| --- | --- |
| 70-100% | Normal |
| 40-69% | Low |
| 20-39% | Warning |
| 0-19% | Critical |

### Smart priority and recommendations

The priority engine ranks communities using shortage and resource information,
including days without water, affected population, tank level, time since
delivery, and alternative water availability.

Priority categories are:

| Score | Priority |
| --- | --- |
| 80-100 | Critical |
| 60-79 | High |
| 40-59 | Medium |
| 0-39 | Low |

The engine can recommend the next village and an available bowser. It is a
decision-support feature: an authorized officer or administrator must review
and approve a dispatch rather than the system automatically dispatching it.

The AI explanation endpoint can explain an existing recommendation in simple
language. The raw priority score remains application logic; AI is used for
explanation rather than replacing the scoring rules.

### Administration and analytics

Administrators can:

- View the administration dashboard
- Manage users and roles
- Enable or disable users
- Monitor tanks and alerts
- View shortage and delivery activity
- View system analytics
- Review priority areas and recommendations

## User roles

### Resident

Residents can register, log in, view village information, report shortages,
review their reports, view deliveries, and join delivery queues.

### Water officer

Officers can review and verify shortage reports, manage bowsers, schedule
deliveries, update delivery status, manage queues, and use priority
recommendations.

### Administrator

Administrators have access to user management, tank management, analytics,
shortage and delivery monitoring, and the smart priority system.

## Application workflow

```text
1. A resident experiences a water shortage.
2. The resident submits a report.
3. The report is stored and made available to authorized officials.
4. The system evaluates shortage and water-resource information.
5. Affected villages are ranked by priority.
6. The next available bowser is identified.
7. An officer reviews the recommendation.
8. The officer schedules and updates the delivery.
9. Residents see the ETA, location, capacity, and queue.
10. The bowser distributes water.
11. The delivery is marked completed.
12. The shortage incident can be resolved.
```

## Technology stack

### Frontend

- React 19
- React Router
- Vite
- Axios
- Recharts
- Lucide React
- CSS

### Backend

- Node.js
- Express 5
- Mongoose
- MongoDB
- JSON Web Tokens (JWT)
- bcryptjs
- express-validator
- CORS
- dotenv

### Development tools

- Git and GitHub
- Visual Studio Code
- Postman or another HTTP client
- Nodemon for backend development

## Repository structure

```text
Water-watch/
├── backend/
│   ├── config/              Database configuration and in-memory fallback
│   ├── controllers/         Authentication, reports, bowsers, deliveries,
│   │                         tanks, admin, and priority logic
│   ├── middleware/          Authentication and error handling
│   ├── models/              Mongoose data models
│   ├── routes/              Express API routes
│   ├── seed.js              Demo bowser and delivery data
│   ├── server.js            API server entry point
│   └── package.json
├── frontend/
│   ├── public/              Public images and static assets
│   ├── src/
│   │   ├── components/      Shared layouts and UI components
│   │   ├── context/         Authentication context
│   │   ├── pages/           Resident, officer, admin, and API pages
│   │   ├── services/        Axios API client
│   │   └── App.jsx          Application routes
│   └── package.json
└── README.MD
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB 6 or newer (local or hosted) for persistent storage
- Git

MongoDB is recommended, but the backend includes a demo in-memory fallback
when MongoDB is unavailable.

## Installation and local development

Clone the repository and install dependencies:

```bash
git clone https://github.com/Gevindu2004/Water-watch.git
cd Water-watch

cd backend
npm install

cd ../frontend
npm install
```

Start the backend in one terminal:

```bash
cd backend
npm start
```

The API is available at `http://localhost:5000`.

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Vite displays the frontend URL, normally `http://localhost:5173`.

Useful scripts:

| Directory | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm start` | Start the API |
| `backend` | `npm run dev` | Start the API with Nodemon |
| `backend` | `npm run seed` | Seed demo bowser and delivery data |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Create a production build |
| `frontend` | `npm run lint` | Run Oxlint |
| `frontend` | `npm run preview` | Preview the production build |

## Configuration

Create `backend/.env` when using custom settings:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/waterwatch
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
```

Defaults:

- `PORT`: `5000`
- `MONGODB_URI`: `mongodb://127.0.0.1:27017/waterwatch`
- `JWT_SECRET`: a development fallback secret in the authentication
  middleware
- Frontend dev server: Vite default port, normally `5173`

Never commit real credentials, production JWT secrets, or hosted database
connection strings.

## Demo accounts

The current officer-focused demo login accepts:

```text
Officer
Email: officer@test.com
Password: password123

Administrator
Email: admin@test.com
Password: password123
```

These credentials are for local demonstration only and must be replaced by
database-backed authentication before production deployment.

## API reference

Base URL:

```text
http://localhost:5000/api
```

The backend returns JSON. Protected endpoints use:

```http
Authorization: Bearer <jwt>
```

### Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | API, component, and database status |

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Authenticated | Return the current user from the token |

Example login:

```json
{
  "email": "officer@test.com",
  "password": "password123"
}
```

### Bowsers

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/bowsers` | Authenticated | List bowsers |
| `POST` | `/api/bowsers` | Officer/Admin | Create a bowser |
| `PUT` | `/api/bowsers/:id` | Officer/Admin | Update bowser details |
| `PATCH` | `/api/bowsers/:id/status` | Officer/Admin | Update status/location |
| `DELETE` | `/api/bowsers/:id` | Officer/Admin | Delete a bowser |

### Deliveries

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/deliveries` | Authenticated | List deliveries |
| `POST` | `/api/deliveries` | Officer/Admin | Schedule a delivery |
| `PUT` | `/api/deliveries/:id` | Officer/Admin | Update a delivery |
| `PATCH` | `/api/deliveries/:id/status` | Officer/Admin | Update delivery status |
| `GET` | `/api/deliveries/village/:villageId` | Public | List deliveries for a village |
| `PATCH` | `/api/deliveries/:id/queue` | Public | Update people waiting |

Queue request examples:

```json
{ "action": "increment" }
```

```json
{ "action": "decrement" }
```

```json
{ "peopleWaiting": 87 }
```

### Water reports

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/water-reports` | Officer/Admin | List reports |
| `GET` | `/api/water-reports/village/:villageId` | Authenticated | List village reports |
| `PATCH` | `/api/water-reports/:id/verify` | Officer/Admin | Verify or update status/priority |

### Tanks

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/tanks` | Public | List tanks |
| `GET` | `/api/tanks/alerts` | Public | List tank alerts |
| `GET` | `/api/tanks/:id` | Public | Get one tank |
| `GET` | `/api/tanks/:id/history` | Public | Get tank history |
| `POST` | `/api/tanks` | Admin | Create a tank |
| `PUT` | `/api/tanks/:id` | Admin | Update a tank |
| `PATCH` | `/api/tanks/:id/level` | Admin/Officer | Update tank level |

### Administration

All administration endpoints require an administrator token.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/admin/dashboard` | Dashboard summary |
| `GET` | `/api/admin/users` | List users |
| `PATCH` | `/api/admin/users/:id/status` | Enable or disable a user |
| `PATCH` | `/api/admin/users/:id/role` | Change a user role |
| `GET` | `/api/admin/analytics` | System analytics |

### Priority and AI explanation

Priority endpoints require an officer or administrator token, except the
health endpoint.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/ai/health` | Public | Priority/AI service status |
| `GET` | `/api/ai/priorities` | Officer/Admin | Rank priority areas |
| `GET` | `/api/ai/priorities/:villageId` | Officer/Admin | Get one village priority |
| `GET` | `/api/ai/recommendation` | Officer/Admin | Recommend the next dispatch |
| `POST` | `/api/ai/explanation` | Officer/Admin | Explain a recommendation |

The priority routes are also mounted under `/api/priorities` for compatibility
with the frontend and existing clients.

## Data model

The main MongoDB collections are:

- `users`
- `villages`
- `waterReports`
- `bowsers`
- `deliveries`
- `tanks`
- `notifications`
- `priorityAssessments`

Typical relationships are:

```text
User       -> Village
WaterReport -> User and Village
Delivery   -> Bowser and Village
Tank       -> Nearby villages
```

When MongoDB is unavailable, the backend uses in-memory demo data for the
bowser, delivery, tank, report, user, and priority features where supported.
Changes made in fallback mode are lost when the server restarts.

## Priority engine

The recommended priority calculation is based on transparent operational
signals:

- Number of days without water
- Number of people affected
- Nearby tank percentage
- Days since the last delivery
- Availability of alternative sources

Example assessment:

```text
Village: Siripura
Days without water: 3
People affected: 120
Tank level: 18%
Days since delivery: 4
Priority: Critical
Recommended action: Dispatch the next available bowser
```

The recommendation is not an automatic dispatch. Human approval is required
before a delivery is created or sent.

## Security

The application includes:

- JWT-based authentication
- bcrypt password hashing for database users
- Role-based authorization
- Protected frontend routes
- Protected officer/admin APIs
- Request validation where applicable
- Centralized backend error handling
- CORS support for local frontend development

For production, configure a strong secret, disable demo credentials, validate
all public inputs, restrict CORS origins, use HTTPS, add rate limiting, and
store secrets outside the repository.

## Seeding demo data

With MongoDB running:

```bash
cd backend
npm run seed
```

The seed script creates demonstration bowsers and deliveries, including
examples for Siripura, Bakamuna, and Welikanda. It uses `MONGODB_URI` or the
default local MongoDB URI.

## Troubleshooting

### The frontend cannot reach the API

1. Confirm the backend is running on port `5000`.
2. Open `http://localhost:5000/api/health`.
3. Confirm the frontend API base URL points to `http://localhost:5000/api`.
4. Check the browser console and backend terminal for errors.

### MongoDB is unavailable

The backend reports `In-Memory Fallback Active` and serves demo data where
fallback support is implemented. Use MongoDB for persistence and complete
database-backed behavior.

### A protected request returns 401 or 403

1. Log in and store the returned token.
2. Send it as `Authorization: Bearer <token>`.
3. Confirm the account has the required role.

### The frontend build fails

```bash
cd frontend
npm install
npm run lint
npm run build
```

## Project scope and future work

The hackathon implementation focuses on an end-to-end workflow using
realistic/demo data. Possible future improvements include:

- IoT tank-level sensors
- GPS tracking for bowsers
- SMS, WhatsApp, and push notifications
- Weather and rainfall integration
- Drought prediction
- Sinhala and Tamil language support
- Mobile and offline reporting
- Government water-authority integration
- Automatic duplicate-report detection
- Demand forecasting
- Multi-village route optimization

## Team responsibilities

### Component 1: Authentication and resident portal

- Login and registration
- JWT and role access
- Resident dashboard
- Village status
- Shortage reporting and history

### Component 2: Water officer and bowser operations

- Officer dashboard
- Bowser management
- Delivery scheduling and status
- Water queues
- Report verification

### Component 3: Administration and water resources

- Admin dashboard
- Tank monitoring and history
- Water-level alerts
- User management
- System analytics

### Component 4: Smart priority and AI

- Priority scoring
- Village ranking
- Next-bowser recommendation
- AI explanations
- Recommendation approval workflow

## Expected outcome

WaterWatch connects the complete coordination process:

```text
Report -> Analyze -> Prioritize -> Recommend -> Approve
       -> Dispatch -> Notify -> Resolve
```

The project demonstrates how community participation, centralized resource
monitoring, role-based access, transparent decision support, and AI-assisted
explanations can improve emergency water distribution.