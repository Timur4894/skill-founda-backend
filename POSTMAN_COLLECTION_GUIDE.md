# 📮 Skill Foundation API - Postman Collection Guide

## 🌐 Base URL
```
http://localhost:3001
```

## 🔧 Environment Variables Setup

Create a new environment in Postman with these variables:

```
base_url: http://localhost:3001
token: {{jwt_token_from_login}}
```

## 📋 Complete API Endpoints

### 🔐 AUTHENTICATION ENDPOINTS

#### 1. Register User
```
POST {{base_url}}/auth/register
Content-Type: application/json

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

#### 2. Login User
```
POST {{base_url}}/auth/login
Content-Type: application/json

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

#### 3. Reset Password
```
POST {{base_url}}/auth/reset-password
Content-Type: application/json

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

---

### 👤 USER MANAGEMENT ENDPOINTS

#### 4. Get All Users
```
GET {{base_url}}/user/get-all-users
```

#### 5. Get User by ID
```
GET {{base_url}}/user/get-user/ae7125cf-0a60-45e5-a75a-6335514dbfe9
```

#### 6. Get Current User (Protected)
```
GET {{base_url}}/user/get-me
Authorization: Bearer {{token}}
```

#### 7. Update Current User Profile (Protected)
```
PATCH {{base_url}}/user/update-me
Authorization: Bearer {{token}}
Content-Type: application/json

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

#### 8. Delete Current User Account (Protected)
```
DELETE {{base_url}}/user/delete-me
Authorization: Bearer {{token}}
```

---

### 🗺️ ROADMAP ENDPOINTS

#### 9. Create Roadmap (Protected)
```
POST {{base_url}}/roadmap/create
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Frontend Development",
  "description": "Learn modern frontend technologies"
}
```

#### 10. Get All My Roadmaps (Protected)
```
GET {{base_url}}/roadmap/my
Authorization: Bearer {{token}}
```

#### 11. Get Roadmap by ID (Protected)
```
GET {{base_url}}/roadmap/1
Authorization: Bearer {{token}}
```

#### 12. Update Roadmap (Protected)
```
PATCH {{base_url}}/roadmap/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Updated Frontend Development",
  "description": "Updated description"
}
```

#### 13. Delete Roadmap (Protected)
```
DELETE {{base_url}}/roadmap/1
Authorization: Bearer {{token}}
```

---

### 📋 ROADMAP ITEM ENDPOINTS

#### 14. Create Roadmap Item (Protected)
```
POST {{base_url}}/roadmap/1/items
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "HTML & CSS Basics",
  "description": "Learn the fundamentals of web markup",
  "order": 1
}
```

#### 15. Get All Roadmap Items (Protected)
```
GET {{base_url}}/roadmap/1/items
Authorization: Bearer {{token}}
```

#### 16. Get Roadmap Item by ID (Protected)
```
GET {{base_url}}/roadmap/items/1
Authorization: Bearer {{token}}
```

#### 17. Update Roadmap Item (Protected)
```
PATCH {{base_url}}/roadmap/items/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Updated HTML & CSS",
  "order": 2
}
```

#### 18. Delete Roadmap Item (Protected)
```
DELETE {{base_url}}/roadmap/items/1
Authorization: Bearer {{token}}
```

---

### 🤖 AI ENDPOINTS

#### 19. Generate Roadmap with AI (Protected)
```
POST {{base_url}}/ai/generate-roadmap
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "topic": "React Development"
}
```

**Response:**
```json
{
  "title": "Complete React Development Roadmap",
  "description": "Master React from basics to advanced concepts",
  "items": [
    {
      "title": "JavaScript Fundamentals",
      "description": "Essential JavaScript concepts for React",
      "order": 1,
      "tasks": [
        {
          "title": "Practice ES6+ features",
          "description": "Work with arrow functions, destructuring, and modules"
        }
      ],
      "documentation": [
        {
          "title": "MDN JavaScript Guide",
          "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
        }
      ],
      "resources": [
        {
          "title": "JavaScript.info",
          "link": "https://javascript.info/"
        }
      ]
    }
  ]
}
```

---

## 🧪 Testing Workflow

### Step 1: Setup
1. Create new environment in Postman
2. Set `base_url` to `http://localhost:3001`
3. Start your server: `npm run start:dev`

### Step 2: Authentication
1. **Register a new user** using endpoint #1
2. **Login** using endpoint #2 and copy the token
3. **Set token** in environment variable `{{token}}`

### Step 3: Test User Management
1. **Get your profile** using endpoint #6
2. **Update your profile** using endpoint #7
3. **Test partial updates** (bio only, skills only)

### Step 4: Test Roadmap Management
1. **Create a roadmap** using endpoint #9
2. **Get all your roadmaps** using endpoint #10
3. **Get specific roadmap** using endpoint #11
4. **Update roadmap** using endpoint #12

### Step 5: Test Roadmap Items
1. **Create roadmap items** using endpoint #14
2. **Get all items** using endpoint #15
3. **Update items** using endpoint #17
4. **Delete items** using endpoint #18

### Step 6: Test AI Generation
1. **Generate roadmap with AI** using endpoint #19
2. **Try different topics**: "Python", "Machine Learning", "DevOps"

---

## 🔒 Security Notes

- All endpoints marked as "Protected" require JWT token
- Add `Authorization: Bearer {{token}}` header for protected endpoints
- Tokens expire after 24 hours
- Users can only access their own data

## 📝 Common Headers

### For JSON requests:
```
Content-Type: application/json
```

### For protected endpoints:
```
Authorization: Bearer {{token}}
```

## 🚨 Error Responses

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

---

## 🎯 Quick Test Examples

### Create Complete Learning Path:
1. Register/Login → Get token
2. Create roadmap: "Full-Stack Development"
3. Add items: "Frontend", "Backend", "Database"
4. Generate AI roadmap: "React Development"
5. Update profile with new skills

### Test AI Generation:
```json
{
  "topic": "Machine Learning with Python"
}
```

```json
{
  "topic": "DevOps and Docker"
}
```

```json
{
  "topic": "Mobile App Development"
}
```

---

**Note:** Replace `{{base_url}}` with your actual server URL and `{{token}}` with your JWT token from login.
