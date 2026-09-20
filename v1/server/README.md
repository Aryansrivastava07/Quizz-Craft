# QuizzCraft Server Documentation

This document provides a detailed overview of the QuizzCraft server application, its structure, API endpoints, and other components.

## Project Overview

QuizzCraft is a platform for creating, managing, and attempting quizzes. This server application provides the backend services for the QuizzCraft platform, including user authentication, quiz generation, and attempt management.

## Folder Structure

```
server/
├───.env
├───index.js
├───package.json
├───src/
│   ├───app.js
│   ├───index.js
│   ├───controllers/
│   │   ├───attempt.controllers.js
│   │   ├───quizCreation.controllers.js
│   │   └───user.controllers.js
│   ├───db/
│   │   └───db.js
│   ├───middlewares/
│   │   ├───authenticator.middleware.js
│   │   └───multer.middleware.js
│   ├───models/
│   │   ├───attempt.model.js
│   │   ├───quiz.model.js
│   │   └───user.model.js
│   ├───routes/
│   │   ├───attempt.routes.js
│   │   ├───quiz.routes.js
│   │   └───user.routes.js
│   └───utils/
│       ├───ApiError.js
│       ├───ApiResponse.js
│       ├───AsyncHandler.js
│       ├───cloudinary.js
│       └───GenerateJWTtoken.js
└───uploads/
```

## API Endpoints

### User API

Base Path: `/api/v1/user`

| Method | Endpoint                             | Description                                      |
|--------|--------------------------------------|--------------------------------------------------|
| POST   | `/register`                          | Register a new user.                             |
| GET    | `/userRequestVerificationMail/:id`   | Send a verification email to the user.           |
| POST   | `/userVerification/:id`              | Verify a user with the provided verification code.|
| POST   | `/login`                             | Log in a user.                                   |
| POST   | `/logout/:id`                        | Log out a user.                                  |
| POST   | `/refreshToken`                      | Refresh the access token for a user.             |
| GET    | `/user`                              | Get the logged-in user's information.            |


### Quiz API

Base Path: `/api/v1/quiz`

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| POST   | `/quizCreation`    | Create a new quiz.         |
| GET    | `/getQuiz`         | Get a quiz by its ID.      |
| POST   | `/updateQuiz`      | Update a quiz.             |
| DELETE | `/deleteQuiz/:id`  | Delete a quiz.             |
| GET    | `/getAllQuizById`  | Get all quizzes created by the user. |



### Attempt API

Base Path: `/api/v1/attempt`

| Method | Endpoint               | Description                                      |
|--------|------------------------|--------------------------------------------------|
| GET    | `/start/:quizId`       | Get a quiz for attempting (without answers).     |
| POST   | `/submit/:quizId`      | Submit a quiz attempt.                           |
| GET    | `/leaderboard/:quizId` | Get the leaderboard for a quiz.                  |
| GET    | `/history`             | Get the attempt history for the logged-in user.  |
| GET    | `/review/:attemptId`   | Review a specific attempt with correct answers.  |


## Models

### User Model (`user.model.js`)

- `username`: String, required, unique
- `email`: String, required, unique
- `password`: String, required
- `verified`: Boolean, default: `false`
- `profilePicture`: String
- `mobileNo`: String, unique
- `address`: String
- `averageScore`: Number, default: `0`
- `verificationId`: Number
- `verificationIdExpiry`: Date
- `refreshToken`: String

### Quiz Model (`quiz.model.js`)

- `title`: String, required
- `creatorId`: ObjectId, ref: 'User', required
- `questions`: Array of objects:
    - `question`: String, required
    - `options`: Array of strings, required
    - `answer`: Number, required
    - `explanation`: String, required
- `type`: String, enum: ['public', 'private'], default: 'public'

### Attempt Model (`attempt.model.js`)

- `userId`: ObjectId, ref: 'User', required
- `quizId`: ObjectId, ref: 'Quiz', required
- `score`: Number, required
- `answers`: Array of numbers, required
- `timeTaken`: Number, required

## Utils

- `ApiError.js`: Custom error class for API errors.
- `ApiResponse.js`: Custom response class for API responses.
- `AsyncHandler.js`: Wrapper for async functions to handle errors.
- `cloudinary.js`: Utility for uploading files to Cloudinary.
- `GenerateJWTtoken.js`: Utilities for generating JWT tokens.

## Middlewares

- `authenticator.middleware.js`: Middleware to authenticate users using JWT.
- `multer.middleware.js`: Middleware for handling multipart/form-data (file uploads).

## Database

- `db.js`: Configures and connects to the MongoDB database.
