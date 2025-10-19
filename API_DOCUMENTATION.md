# 🚀 Skill Foundation API Documentation

## Base URL
```
http://localhost:3001
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

**Validation Rules:**
- `username`: Minimum 3 characters
- `email`: Must be a valid email format
- `password`: Minimum 6 characters

**Response:**
```json
{
  "user": {
    "id": "ae7125cf-0a60-45e5-a75a-6335514dbfe9",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": null,
    "bio": null,
    "skills": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
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
    "id": "ae7125cf-0a60-45e5-a75a-6335514dbfe9",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": null,
    "bio": null,
    "skills": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
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

**Note:** A new password will be generated and sent to the user's email address. The user should change this password after logging in.

## 👤 User Management

### 4. Get All Users
**GET** `/user/get-all-users`

**Response:**
```json
[
  {
    "id": "ae7125cf-0a60-45e5-a75a-6335514dbfe9",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": null,
    "bio": "Full-stack developer with 5 years of experience",
    "skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
    "createdAt": "2024-01-01T00:00:00.000Z"
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
  "id": "ae7125cf-0a60-45e5-a75a-6335514dbfe9",
  "username": "john_doe",
  "email": "john@example.com",
  "profilePicture": "https://example.com/avatar.jpg",
  "bio": "Full-stack developer with 5 years of experience",
  "skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
  "createdAt": "2024-01-01T00:00:00.000Z"
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
  "id": "ae7125cf-0a60-45e5-a75a-6335514dbfe9",
  "username": "john_doe",
  "email": "john@example.com",
  "profilePicture": "https://example.com/avatar.jpg",
  "bio": "Full-stack developer with 5 years of experience",
  "skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 7. Update Current User Profile (Protected)
**PATCH** `/user/update-me`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body (All fields are optional):**
```json
{
  "username": "new_username",
  "email": "newemail@example.com",
  "profilePicture": "https://example.com/new-avatar.jpg",
  "bio": "Updated bio description",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "Docker"]
}
```

**Examples of partial updates:**

Update only bio:
```json
{
  "bio": "I'm a passionate developer who loves creating amazing web applications"
}
```

Update only skills:
```json
{
  "skills": ["React", "Vue.js", "CSS", "Figma"]
}
```

Update username and profile picture:
```json
{
  "username": "john_developer",
  "profilePicture": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "affected": 1,
  "generatedMaps": [],
  "raw": []
}
```

**Validation Rules:**
- `username`: Minimum 3 characters (optional)
- `email`: Must be a valid email format (optional)
- `profilePicture`: String (optional)
- `bio`: String (optional)
- `skills`: Array of strings (optional)

### 8. Delete Current User Account (Protected)
**DELETE** `/user/delete-me`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Note:** This action is irreversible. The user account and all associated data will be permanently deleted.

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

### 422 Unprocessable Entity (Validation Error)
```json
{
  "statusCode": 422,
  "message": [
    "username must be longer than or equal to 3 characters",
    "email must be an email"
  ],
  "error": "Unprocessable Entity"
}
```

## 📝 Postman Collection Setup

### Environment Variables
Create a new environment in Postman with these variables:

```
base_url: http://localhost:3001
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
3. **Get your profile** using `/user/get-me`
4. **Update your profile** using `/user/update-me` (try partial updates)
5. **Test password reset** using `/auth/reset-password`
6. **Delete your account** using `/user/delete-me` (if needed)

## 📋 User Profile Fields

### Required Fields (Registration)
- `username`: Unique username (min 3 characters)
- `email`: Valid email address (unique)
- `password`: Password (min 6 characters)

### Optional Fields (Can be updated later)
- `profilePicture`: URL to profile image
- `bio`: Text description of the user
- `skills`: Array of skill strings

## 🔒 Security Features

- **JWT Authentication**: All protected routes require valid JWT token
- **Self-service only**: Users can only update/delete their own accounts
- **Password hashing**: Passwords are securely hashed using bcrypt
- **Email validation**: All email fields are validated
- **Input validation**: All inputs are validated using class-validator

## 📧 Email Configuration

The API supports email sending for password reset functionality. Configure these environment variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
```

## 🚀 Development Setup

1. **Install dependencies**: `npm install`
2. **Set up environment variables**: Create `.env` file
3. **Start development server**: `npm run start:dev`
4. **Build for production**: `npm run build`
5. **Start production server**: `npm run start:prod`

---

**Note:** Replace `http://localhost:3001` with your actual deployment URL when deploying to production.