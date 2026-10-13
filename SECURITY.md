# Security Features

## Implemented

### 1. Password Hashing (bcryptjs)
- Passwords are hashed with bcrypt before storing in MongoDB
- Uses salt rounds of 10
- Never stored in plain text
- Location: `server/controllers/authController.js`

### 2. JWT Authentication
- JSON Web Tokens for stateless authentication
- Tokens expire in 7 days
- Token stored in localStorage on frontend
- Token verified on every protected request
- Location: `server/middleware/auth.js`

### 3. Protected Routes
- All sensitive routes require authentication via `auth` middleware
- Returns 401 if no token provided
- Returns 401 if token is invalid or expired
- Location: `server/middleware/auth.js`

### 4. Role-Based Authorization
- `authorize("seller", "admin")` middleware checks user role
- Returns 403 if authenticated but not authorized
- 401 = "Not authenticated" (no valid token)
- 403 = "Not authorized" (valid token but wrong role)
- Location: `server/middleware/authorize.js`

### 5. Input Validation
- All POST/PUT routes use express-validator
- Validates email format, password length, required fields
- Sanitizes input with `.trim()`
- Location: `server/validators/`

### 6. Environment Variables
- `.env` file is in `.gitignore`
- JWT_SECRET, MONGODB_URI never hardcoded
- Example template in `.env.example`
- Location: `server/.env.example`

### 7. Secure Error Messages
- `AppError` class for operational errors
- In production: generic "Something went wrong" for unknown errors
- No stack traces leaked in production
- Location: `server/utils/errorHandler.js`

### 8. No Passwords in Responses
- User schema has `select: false` on password field
- Controllers never return password field
- Location: `server/models/User.js`

### 9. Stock Validation
- Cart validates available stock before adding items
- Order placement validates stock before creating order
- Prevents overselling
- Location: `server/services/cartService.js`, `server/services/orderService.js`

### 10. CORS Protection
- Express CORS middleware enabled
- Can be configured to specific origins in production

## Best Practices for Interviews

### 401 vs 403
- **401 Unauthorized**: User is not authenticated (no token, expired token, invalid token)
- **403 Forbidden**: User is authenticated but doesn't have the right role/permissions

### JWT Explanation
JWT (JSON Web Token) is a stateless authentication token. It contains:
1. Header (algorithm)
2. Payload (user ID, expiration)
3. Signature (signed with JWT_SECRET)

The server signs the token on login. The client sends it in the Authorization header as `Bearer <token>`. The server verifies the signature without needing to store sessions.

### How to Explain
"In my project, when a user logs in, the server creates a JWT containing their user ID and signs it with a secret key. This token is sent back to the client, which stores it in localStorage. On every subsequent API request, the client sends the token in the Authorization header. The server verifies the token signature, extracts the user ID, and attaches the user to the request. Role-based authorization then checks if the user has permission to access the specific route."
