<h1>Ride Booking API – RESTful Endpoints Summary</h1>

This backend API supports a ride booking system with three roles: Admin, Driver, Rider. It includes secure authentication, role-based authorization, and ride lifecycle management.

✅<h2>Athentication</h2>

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | /api/auth/register | Register a new user     |
| POST   | /api/auth/login    | Login and get JWT token |
| post   | /api/auth/logout   | logout user             |



✅<h2>Admin API Endpoints</h2>
| Method | Endpoint                        | Description            |
| ------ | ------------------------------- | ---------------------- |
| GET    | /api/admin/users                | View all users         |
| GET    | /api/admin/drivers              | View all drivers       |
| PATCH  | /api/admin/users/block/\:id     | Block a user account   |
| PATCH  | /api/admin/users/unblock/\:id   | Unblock a user account |
| PATCH  | /api/admin/drivers/approve/\:id | Approve a driver       |
| PATCH  | /api/admin/drivers/suspend/\:id | Suspend a driver       |



✅<h2>Rider APIs</h2>
| Method | Endpoint               | Description                             |
| ------ | ---------------------- | --------------------------------------- |
| POST   | /api/rides/request     | Request a ride (pickup & destination)   |
| PATCH  | /api/rides/cancel/\:id | Cancel own ride (before driver accepts) |
| GET    | /api/rides/me          | View own ride history                   |



✅<h2>Driver APIs</h2>
| Method | Endpoint                   | Description                                 |
| ------ | -------------------------- | ------------------------------------------- |
| PATCH  | /api/rides/accept/\:id     | Accept a ride request                       |
| PATCH  | /api/rides/reject/\:id     | Reject a ride request (optional)            |
| PATCH  | /api/rides/\:id/pickup     | Mark ride as picked up                      |
| PATCH  | /api/rides/\:id/in-transit | Mark ride as in transit                     |
| PATCH  | /api/rides/\:id/complete   | Mark ride as completed                      |
| GET    | /api/rides/earnings        | View completed rides & total earnings       |
| PATCH  | /api/drivers/availability  | Set driver availability (ACTIVE / INACTIVE) |

<h2>✅Extra Features</h2>
*Password hashing (bcrypt)

*JWT-based login & route protection

*User blocking/unblocking by admin

*Driver approval/suspension by admin

*Complete ride history for riders

*Earnings history for drivers

*Timestamps history for each ride status



<h2>✅Tech Stack</h2>
*Node.js, Express.js

*MongoDB & Mongoose

*JWT, bcrypt

*Clean architecture: controllers, services, middlewares




