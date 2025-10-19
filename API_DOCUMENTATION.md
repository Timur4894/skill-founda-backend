# 🚀 Skill Foundation API Documentation

## Base URL
```
https://your-vercel-app.vercel.app
```

## 🔐 Authentication

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "New password sent to your email"
}
```

## 👤 User Management

### 4. Get All Users
**GET** `/user/get-all-users`

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 5. Get User by ID
**GET** `/user/get-user/:id`

**Parameters:**
- `id` (string) - User UUID

**Response:**
```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 6. Get Current User (Protected)
**GET** `/user/get-me`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 📊 Roadmap (Coming Soon)
**GET** `/roadmap`
*Endpoints will be added when roadmap functionality is implemented*

## 📈 Progress (Coming Soon)
**GET** `/progress`
*Endpoints will be added when progress functionality is implemented*

## 🤖 AI (Coming Soon)
**GET** `/ai`
*Endpoints will be added when AI functionality is implemented*

## 🔧 Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Username or email already exists",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## 📝 Postman Collection Setup

### Environment Variables
Create a new environment in Postman with these variables:

```
base_url: https://your-vercel-app.vercel.app
token: {{jwt_token_from_login}}
```

### Headers for Protected Routes
For routes that require authentication, add this header:
```
Authorization: Bearer {{token}}
```

## 🧪 Testing Workflow

1. **Register a new user** using `/auth/register`
2. **Login** using `/auth/login` and save the token
3. **Test protected routes** using the saved token
4. **Test password reset** using `/auth/reset-password`

## 📋 Validation Rules

### Registration/Login
- `email`: Must be a valid email format
- `username`: Minimum 6 characters
- `password`: Minimum 6 characters

### Password Reset
- `email`: Must be a valid email format

---

**Note:** Replace `https://your-vercel-app.vercel.app` with your actual Vercel deployment URL.
