# 📚 Weight Tracker API Documentation

## Base URL
```
Production: https://weighttracker-1.onrender.com
Development: http://localhost:5000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {
    // Additional error details (optional)
  }
}
```

## Endpoints

### 🔐 Authentication

#### Register New User
Creates a new user account.

**Endpoint:** `POST /api/users/register`

**Request Body:**
```json
{
  "username": "string (required, 3-30 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "currentWeight": "number (required, min 1)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "currentWeight": 75.5,
      "createdAt": "2025-01-20T10:30:00.000Z"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "User registered successfully"
}
```

**Validation Rules:**
- Username: 3-30 characters, alphanumeric and underscores only
- Email: Valid email format
- Password: Minimum 6 characters
- Current Weight: Positive number

---

#### Login User
Authenticates existing user.

**Endpoint:** `POST /api/users/login`

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "currentWeight": 75.5
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "Login successful"
}
```

**Rate Limiting:** 10 attempts per 10 minutes per IP

---

#### Refresh Access Token
Generates new access token using refresh token.

**Endpoint:** `POST /api/users/refresh`

**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_access_token"
  },
  "message": "Token refreshed successfully"
}
```

---

#### Logout User
Invalidates user tokens.

**Endpoint:** `POST /api/users/logout`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### Update Current Weight
Updates user's current weight in profile.

**Endpoint:** `PUT /api/users/current-weight`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentWeight": "number (required, min 1)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentWeight": 74.2
  },
  "message": "Current weight updated successfully"
}
```

---

### ⚖️ Weight Management

#### Get Weight Entries
Retrieves paginated weight entries for authenticated user.

**Endpoint:** `GET /api/weight`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "entry_id",
        "weight": 74.5,
        "note": "After workout",
        "date": "2025-01-20T10:30:00.000Z",
        "createdAt": "2025-01-20T10:30:00.000Z",
        "updatedAt": "2025-01-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalEntries": 48,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Weight entries retrieved successfully"
}
```

---

#### Add Weight Entry
Creates a new weight entry.

**Endpoint:** `POST /api/weight`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "weight": "number (required, min 1, max 1000)",
  "note": "string (optional, max 200 chars)",
  "date": "string (optional, ISO date, defaults to now)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_entry_id",
    "weight": 74.5,
    "note": "After workout",
    "date": "2025-01-20T10:30:00.000Z",
    "userId": "user_id",
    "createdAt": "2025-01-20T10:30:00.000Z",
    "updatedAt": "2025-01-20T10:30:00.000Z"
  },
  "message": "Weight entry added successfully"
}
```

**Validation Rules:**
- Weight: 1-1000 kg
- Note: Maximum 200 characters
- Date: Valid ISO date string

---

#### Update Weight Entry
Updates an existing weight entry.

**Endpoint:** `PUT /api/weight/:id`

**Headers:** `Authorization: Bearer <token>`

**URL Parameters:**
- `id`: Weight entry ID

**Request Body:**
```json
{
  "weight": "number (optional, min 1, max 1000)",
  "note": "string (optional, max 200 chars)",
  "date": "string (optional, ISO date)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "entry_id",
    "weight": 74.2,
    "note": "Updated note",
    "date": "2025-01-20T10:30:00.000Z",
    "userId": "user_id",
    "createdAt": "2025-01-20T10:30:00.000Z",
    "updatedAt": "2025-01-20T11:00:00.000Z"
  },
  "message": "Weight entry updated successfully"
}
```

---

#### Delete Weight Entry
Deletes a weight entry.

**Endpoint:** `DELETE /api/weight/:id`

**Headers:** `Authorization: Bearer <token>`

**URL Parameters:**
- `id`: Weight entry ID

**Response:**
```json
{
  "success": true,
  "message": "Weight entry deleted successfully"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate email/username) |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

## Common Error Examples

### Validation Error
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "field": "email",
    "message": "Email must be a valid email address"
  }
}
```

### Authentication Error
```json
{
  "success": false,
  "error": "Authentication failed",
  "details": {
    "message": "Token expired"
  }
}
```

### Rate Limit Error
```json
{
  "success": false,
  "error": "Too many requests",
  "details": {
    "retryAfter": 600,
    "message": "Rate limit exceeded. Try again in 10 minutes."
  }
}
```

## Security Headers

The API includes the following security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## CORS Policy

CORS is configured to allow requests from:
- `http://localhost:5173` (development)
- `https://your-frontend-domain.com` (production)

## Rate Limiting

- **Login endpoint**: 10 requests per 10 minutes per IP
- **General API**: 100 requests per 15 minutes per IP
- **Weight operations**: 50 requests per 10 minutes per user

## Testing the API

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "currentWeight": 70
  }'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Add weight entry (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/weight \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "weight": 69.5,
    "note": "Morning weight"
  }'
```

### Using Postman

Import this collection URL:
```
https://www.postman.com/collections/weight-tracker-api
```

## SDK Examples

### JavaScript/Node.js
```javascript
const API_BASE = 'https://weighttracker-1.onrender.com/api';

class WeightTrackerAPI {
  constructor(token = null) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    return response.json();
  }

  async login(email, password) {
    const response = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      this.token = response.data.token;
    }
    
    return response;
  }

  async addWeight(weight, note = '') {
    return this.request('/weight', {
      method: 'POST',
      body: JSON.stringify({ weight, note })
    });
  }

  async getWeightEntries(page = 1, limit = 10) {
    return this.request(`/weight?page=${page}&limit=${limit}`);
  }
}

// Usage
const api = new WeightTrackerAPI();
await api.login('user@example.com', 'password');
const entries = await api.getWeightEntries();
```

---

📝 **Last Updated:** January 2025  
🔗 **API Version:** 1.0  
📧 **Support:** Create an issue on GitHub
