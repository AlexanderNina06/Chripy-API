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

Below is a manual reference of all available HTTP endpoints exposed by the Chirpy API.

---

### 🔐 Authentication

#### `POST /api/login`

Authenticate a user using email and password.

**Request body**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200)**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "token": "<access_token>",
  "refreshToken": "<refresh_token>"
}
```

---

#### `POST /api/refresh`

Generate a new access token using a valid refresh token.

**Headers**

```
Authorization: Bearer <refresh_token>
```

**Response (200)**

```json
{
  "token": "<new_access_token>"
}
```

---

#### `POST /api/revoke`

Revoke a refresh token (logout).

**Headers**

```
Authorization: Bearer <refresh_token>
```

**Response (204)**
*No content*

---

### 👤 Users

#### `POST /api/users`

Create a new user account.

**Request body**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201)**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "isChirpyRed": false
}
```

---

#### `PUT /api/users`

Update the authenticated user's email and password.

**Headers**

```
Authorization: Bearer <access_token>
```

**Request body**

```json
{
  "email": "new@example.com",
  "password": "newPassword123"
}
```

**Response (200)**

```json
{
  "id": "uuid",
  "email": "new@example.com",
  "isChirpyRed": false
}
```

---

### 🐦 Chirps

#### `GET /api/chirps`

Fetch all chirps.

**Optional query params**

* `authorId=<uuid>` – filter by author
* `sort=asc|desc` – sort by creation date (default: asc)

---

#### `GET /api/chirps/:chirpID`

Fetch a single chirp by ID.

---

#### `POST /api/chirps`

Create a new chirp (authenticated).

**Headers**

```
Authorization: Bearer <access_token>
```

**Request body**

```json
{
  "body": "Hello Chirpy!"
}
```

**Response (201)**

```json
{
  "id": "uuid",
  "body": "Hello Chirpy!",
  "userId": "uuid",
  "createdAt": "timestamp"
}
```

---

#### `DELETE /api/chirps/:chirpID`

Delete a chirp (only by its owner).

**Headers**

```
Authorization: Bearer <access_token>
```

**Response (204)**
*No content*

---

### 💎 Webhooks

#### `POST /api/polka/webhooks`

Webhook endpoint used to upgrade users to Chirpy Red.

**Headers**

```
Authorization: ApiKey <POLKA_KEY>
```

**Request body**

```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "uuid"
  }
}
```

**Response (204)**
*No content*

---

### 🛠 Admin

#### `POST /admin/reset`

Reset all users (development only).

**Response (200)**

```text
OK
```

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
