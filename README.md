# Chirpy API

## 📣 Project Overview

**Chirpy** is a backend REST API for a lightweight social network inspired by Twitter. It was built as part of the **Boot.dev Back-End Track** to practice real-world web server development using **TypeScript**, **Express**, **PostgreSQL**, and **Drizzle ORM**.

The project focuses on building a production-style HTTP server with authentication, authorization, database persistence, and clean API design.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization

* User registration and login
* Password hashing with Argon2
* JWT-based authentication (access tokens)
* Refresh tokens with expiration and revocation
* Token rotation and logout support

### 🐦 Chirps (Posts)

* Create chirps (max 140 characters)
* Delete chirps (only by the owner)
* Fetch all chirps
* Fetch chirps by author
* Sort chirps by creation date (`asc` / `desc`)

### 👤 Users

* Create users
* Update own email and password
* Authorization enforced via access tokens

### 💎 Chirpy Red

* Users can be upgraded to **Chirpy Red** via a webhook
* Secure webhook authentication using API keys

### 🧹 Admin & Utilities

* Reset users endpoint (admin-only)
* Request metrics middleware
* Structured error handling

---

## 🧱 Tech Stack

* **TypeScript** – Type-safe backend development
* **Node.js** – Runtime environment
* **Express** – HTTP server framework
* **PostgreSQL** – Relational database
* **Drizzle ORM** – Type-safe SQL ORM
* **Argon2** – Secure password hashing
* **JWT** – Stateless authentication

---

## 📡 API Endpoints

### Auth

* `POST /api/login`
* `POST /api/refresh`
* `POST /api/revoke`

### Users

* `POST /api/users`
* `PUT /api/users`

### Chirps

* `GET /api/chirps`
* `GET /api/chirps/:chirpID`
* `POST /api/chirps`
* `DELETE /api/chirps/:chirpID`

### Webhooks

* `POST /api/polka/webhooks`

### Admin

* `POST /admin/reset`

---

## 🔐 Environment Variables

```env
DATABASE_URL=postgres://...
SECRET=your_jwt_secret
POLKA_KEY=your_webhook_api_key
```

---

## 🧠 Learning Goals

This project demonstrates:

* How real authentication systems work (JWT + refresh tokens)
* How to design secure REST APIs
* Proper separation of concerns (handlers, services, DB)
* Error handling and HTTP status codes
* Middleware usage in Express

---

## 🏁 Final Notes

Chirpy is not just a demo—it mirrors patterns used in real-world backend systems. It represents a full integration of concepts learned throughout the Boot.dev backend path.

