# API Documentation

This is the documentation for the API endpoints provided by the application.

## Base URL

The base URL for all API endpoints is `http://your-domain.com`.

## Authentication

All endpoints except for `/api/register` and `/api/login` require authentication. Authentication is done using a Bearer token. Include the token in the `Authorization` header of each request in the following format:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Get All Users

Retrieve a list of all users.

- URL: `/api/users`
- Method: GET
- Authentication: Required
- Response Body: Array of user objects
- Response Status Codes:
  - 200: Success
  - 500: Internal Server Error

### 2. Get User by ID

Retrieve a user by their ID.

- URL: `/api/users/:userId`
- Method: GET
- Authentication: Required
- Path Parameters:
  - `userId`: The ID of the user
- Response Body: User object
- Response Status Codes:
  - 200: Success
  - 404: User not found
  - 500: Internal Server Error

### 3. User Registration

Register a new user.

- URL: `/api/register`
- Method: POST
- Authentication: Not required
- Request Body:
  - `first_name`: First name of the user (required)
  - `last_name`: Last name of the user (required)
  - `email`: Email address of the user (required)
  - `password`: Password for the user (required)
- Response Body: User object
- Response Status Codes:
  - 201: User created successfully
  - 400: Bad request (missing input)
  - 409: User already exists
  - 500: Internal Server Error

### 4. User Login

Authenticate a user and generate a token.

- URL: `/api/login`
- Method: POST
- Authentication: Not required
- Request Body:
  - `email`: Email address of the user (required)
  - `password`: Password for the user (required)
- Response Body:
  - `user`: User object
  - `token`: Bearer token for authentication
- Response Status Codes:
  - 200: Success
  - 400: Invalid credentials
  - 500: Internal Server Error

### 5. User Logout

Invalidate the token for a user and log them out.

- URL: `/api/logout/:userId`
- Method: DELETE
- Authentication: Required
- Path Parameters:
  - `userId`: The ID of the user
- Response Body:
  - `message`: Logout successful
- Response Status Codes:
  - 200: Success
  - 404: User not found
  - 500: Internal Server Error

Note: The `/logout` endpoint is commented out in the code and not accessible.

## Error Responses

In case of an error, the response will contain an `error` field in the JSON body with a corresponding error message.

Example error response:

```json
{
  "error": "User not found"
}
```

## Handling Internal Server Errors

If an internal server error occurs, the response will have a status code of 500 and an `error` field in the JSON body with a generic error message.

Example internal server error response:

```json
{
  "error": "Internal Server Error"
}
```

It is recommended to handle these errors gracefully in your application.
