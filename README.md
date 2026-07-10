# Booking Platform API

A RESTful API built with NestJS for managing services and customer bookings.
Built as a technical assignment for EN2H Software Engineer Internship.

## Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt
- **Documentation:** Swagger UI
- **Validation:** class-validator + class-transformer

## Project Overview

This API allows:

- Staff (authenticated users) to manage services and view/update bookings
- Customers (unauthenticated) to browse services and create bookings

## Installation

### Prerequisites - Node.js v18 or higher - PostgreSQL v14 or higher - npm

### Steps

1. Clone the repository
   git clone https://github.com/farwiinm/booking-platform-en2h
   cd booking-platform

2. Install dependencies
   npm install

3. Set up environment variables (see below)

4. Create the database
   psql -U postgres -c "CREATE DATABASE booking_platform"

5. Run the application
   npm run start:dev

## Environment Variables

Copy .env.example to .env and fill in your values:
cp .env.example .env

| Variable       | Description                       | Example          |
| -------------- | --------------------------------- | ---------------- |
| DB_HOST        | PostgreSQL host                   | localhost        |
| DB_PORT        | PostgreSQL port                   | 5432             |
| DB_USERNAME    | PostgreSQL username               | postgres         |
| DB_PASSWORD    | PostgreSQL password               | yourpassword     |
| DB_NAME        | Database name                     | booking_platform |
| JWT_SECRET     | Secret key for signing JWT tokens | a_long_secret    |
| JWT_EXPIRES_IN | Token expiry duration             | 7d               |

## Database Setup

This project uses TypeORM with synchronize: true in development.
Tables are created automatically when the application starts.

No manual migration step is required for development.

## Running the Application

Development (with hot reload):
npm run start:dev

Production:
npm run build
npm run start:prod

## API Documentation

Interactive Swagger documentation is available at:
http://localhost:3000/api

### Authentication

1. Register: POST /auth/register
2. Login: POST /auth/login — returns an access_token
3. Use the token as: Authorization: Bearer <access_token>

### Endpoints Summary

| Method | Route                | Auth Required | Description           |
| ------ | -------------------- | ------------- | --------------------- |
| POST   | /auth/register       | No            | Register new user     |
| POST   | /auth/login          | No            | Login and get token   |
| GET    | /services            | No            | Get all services      |
| GET    | /services/:id        | No            | Get service by ID     |
| POST   | /services            | Yes           | Create service        |
| PATCH  | /services/:id        | Yes           | Update service        |
| DELETE | /services/:id        | Yes           | Delete service        |
| POST   | /bookings            | No            | Create booking        |
| GET    | /bookings            | Yes           | Get all bookings      |
| GET    | /bookings/:id        | Yes           | Get booking by ID     |
| PATCH  | /bookings/:id/status | Yes           | Update booking status |
| DELETE | /bookings/:id        | Yes           | Cancel booking        |

## Business Rules

- A booking must reference an existing service
- Booking dates cannot be in the past
- A cancelled booking cannot be marked as completed
- Only authenticated users can manage services
- Customers can create bookings without authentication

## Assumptions Made

- 'Cancel Booking' sets status to CANCELLED rather than deleting the record,
  to preserve booking history
- bookingTime uses HH:MM format (24-hour)
- A single user role is used (no admin/staff distinction)

## Bonus Features Implemented

- **Duplicate booking prevention** — Returns 409 Conflict if the same service, date, and time slot is already booked (cancelled bookings are excluded from the check)
- **Filter by status** — GET /bookings?status=PENDING filters results
  Accepts: PENDING | CONFIRMED | CANCELLED | COMPLETED
- **Pagination** — GET /bookings?page=1&limit=10 returns paginated results
  Response includes a meta object with total, page, limit, and totalPages
- **Swagger documentation** — Interactive docs at http://localhost:3000/api
- **Global exception handling** — All errors return a consistent JSON format including statusCode, message, timestamp, and path

## Future Improvements

- Email notifications on booking confirmation
- Role-based access control (admin vs staff)
- Recurring service availability schedules
