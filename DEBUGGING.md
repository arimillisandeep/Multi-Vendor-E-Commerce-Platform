# Debugging Guide

## 1. MongoDB Connection Errors

### Error: `MongoServerSelectionError` / `Connection refused`
- **Cause**: MongoDB server is not running or URI is wrong
- **Fix**:
  1. Check your `MONGODB_URI` in `.env`
  2. For Atlas: verify IP whitelist includes `0.0.0.0/0`
  3. For Atlas: verify username/password in the connection string
  4. For local: run `mongod` before starting the server
  5. Use `mongodb-memory-server` for development if no MongoDB available

### Error: `Authentication failed`
- **Cause**: Wrong username/password in MongoDB URI
- **Fix**: Reset the password in MongoDB Atlas or local MongoDB

## 2. CORS Errors

### Error: `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`
- **Cause**: CORS not configured or origin not allowed
- **Fix**: 
  ```js
  // In server.js, configure CORS with specific origin
  app.use(cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true,
  }));
  ```

## 3. JWT Errors

### Error: `jwt malformed`
- **Cause**: Token is malformed or missing
- **Fix**: Ensure client sends `Authorization: Bearer <token>`

### Error: `TokenExpiredError`
- **Cause**: JWT has expired
- **Fix**: Re-login the user. On client, clear localStorage and redirect to login
- **Prevention**: Tokens expire in 7 days (configurable in `server/utils/generateToken.js`)

### Error: `jwt must be provided`
- **Cause**: No token in Authorization header
- **Fix**: Verify the token is being sent from the client (check localStorage)

## 4. 401 Unauthorized Errors

### Cause: Token missing, invalid, or expired
- **Fix**:
  1. Check the Authorization header format: `Bearer <token>`
  2. Verify the token hasn't expired
  3. Check that the user still exists in the database
  4. Check that `user.isActive` is true

### Debug steps:
1. Test with Postman with the correct Bearer token
2. Decode the JWT at https://jwt.io to check payload and expiration
3. Check `server/middleware/auth.js` for token extraction

## 5. 403 Forbidden Errors

### Cause: User authenticated but lacks required role
- **Fix**: Check the `authorize` middleware in the route
- Example: `authorize("seller", "admin")` means only sellers and admins can access
- Verify user's role in the database

## 6. 404 Not Found Errors

### Cause: Route doesn't exist or typo in URL
- **Fix**:
  1. Check the route is defined in `server/routes/`
  2. Check the route is mounted in `server/server.js`
  3. Verify the HTTP method (GET/POST/PUT/DELETE) matches

## 7. 500 Internal Server Errors

### Cause: Unhandled error in server code
- **Fix**:
  1. Check server console for stack traces
  2. Look for missing imports or undefined variables
  3. Check database queries for invalid references
  4. Ensure all async operations are wrapped in try/catch

## 8. React Errors

### Error: `Cannot read properties of undefined`
- **Cause**: Accessing property of undefined data (often API response)
- **Fix**:
  1. Add optional chaining: `product?.name`
  2. Check if data exists before rendering
  3. Ensure loading states are handled

### Error: `Cannot find module`
- **Cause**: Import path is wrong
- **Fix**: Check the import path and file extension

## 9. API Errors

### Error: `Network Error` on frontend
- **Cause**: Backend server is not running
- **Fix**: Start the backend with `cd server && npm run dev`

### Error: `ECONNREFUSED`
- **Cause**: Cannot connect to backend
- **Fix**: Check if backend is running on port 5000
- **Fix**: Check VITE_API_URL in `.env` matches backend port

## 10. Environment Variable Errors

### Error: `MONGODB_URI is undefined`
- **Cause**: `.env` file not found or variable not set
- **Fix**:
  1. Copy `.env.example` to `.env`
  2. Fill in the correct MongoDB URI
  3. Ensure `.env` is in the `server/` directory
  4. Restart the server after changing `.env`

## 11. npm Errors

### Error: `command not found` for npm
- **Fix**: Install Node.js from https://nodejs.org

### Error: `npm ERR! missing script: dev`
- **Fix**: Ensure `package.json` has `"dev": "nodemon server.js"` in scripts

## 12. Port Conflicts

### Error: `EADDRINUSE: address already in use :::5000`
- **Cause**: Port 5000 is already in use
- **Fix**:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /F /PID <PID>
  ```
  Or change the port in `.env`: `PORT=5001`

## Quick Debug Checklist

1. Is the backend running? (`http://localhost:5000/`)
2. Is the frontend running? (`http://localhost:5173/`)
3. Is MongoDB connected? (check terminal output)
4. Is `.env` file present and correct?
5. Are there any errors in the backend console?
6. Are the API URLs correct in the frontend?
7. Is the JWT token present in localStorage?
