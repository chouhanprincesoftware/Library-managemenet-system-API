# Library Management System API

A RESTful API built using Node.js, Express.js, and MongoDB to manage books, students, and book issue/return operations. The project also includes user authentication using JWT and password hashing with bcrypt.

## Features

* **Book Management:** Create, view, update, and delete books.
* **Student Management:** Create, view, update, and delete student records.
* **Issue Books:** Issue books to students with availability checks.
* **Return Books:** Return issued books and update available copies.
* **User Signup:** Register users with securely hashed passwords.
* **User Login:** Authenticate users and generate JWT tokens.
* **Protected Profile:** Access user profile through token authentication.
* **MongoDB Atlas:** Store application data in MongoDB.

## Technologies Used

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* bcrypt
* JSON Web Token (JWT)
* dotenv

## Prerequisites

Install the following before running the project:

* Node.js and npm
* A MongoDB Atlas account or another MongoDB instance

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd Library-management-system-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project's root directory and add:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_strong_random_secret
```

Replace the example values with your own configuration. Never upload your `.env` file or share your database credentials.

### 4. Start the Server

Run the project using:

```bash
node server.js
```

If nodemon is installed, you can also use:

```bash
npx nodemon server.js
```

The server will run on the port configured in your environment variables, or port `5000` by default.

## API Endpoints

### General

| Method | Endpoint | Description             |
| ------ | -------- | ----------------------- |
| GET    | `/`      | Check the root endpoint |

### Authentication

| Method | Endpoint        | Description                               |
| ------ | --------------- | ----------------------------------------- |
| POST   | `/auth/signup`  | Register a user                           |
| POST   | `/auth/login`   | Log in and receive a JWT                  |
| GET    | `/auth/profile` | Retrieve the authenticated user's profile |

### Books

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| POST   | `/books`     | Add a book         |
| GET    | `/books`     | Retrieve all books |
| PUT    | `/books/:id` | Update a book      |
| DELETE | `/books/:id` | Delete a book      |

### Students

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| POST   | `/students`     | Add a student         |
| GET    | `/students`     | Retrieve all students |
| PUT    | `/students/:id` | Update a student      |
| DELETE | `/students/:id` | Delete a student      |

### Book Issue and Return

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/issues`            | Issue a book to a student |
| GET    | `/issues`            | Retrieve issue records    |
| PUT    | `/issues/:id/return` | Return an issued book     |

**Note:** The `:id` parameter represents the relevant MongoDB document ID. Request bodies must match the fields expected by the application.

## Authentication

The application uses JSON Web Tokens (JWT) for authentication.

1. Register through `/auth/signup`.
2. Log in through `/auth/login` to receive a token.
3. Include the token in the `Authorization` header when accessing the protected profile endpoint.

Header format:

```text
Authorization: Bearer <your_jwt_token>
```

Passwords are hashed using bcrypt before being stored in the database.

## Project Structure

```text
Library-management-system-API/
├── middleware/
│   └── auth.js
├── models/
│   ├── Book.js
│   ├── issue.js
│   ├── Student.js
│   └── User.js
├── .env
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Security Notes

* Keep environment variables and database credentials private.
* Use a strong, random JWT secret.
* Do not commit `.env` or `node_modules` to GitHub.
* The profile endpoint requires JWT authentication. Other endpoints should be checked in the application code to confirm their authentication requirements.

## Future Improvements

The project can be extended with additional validation, improved error handling, and stronger consistency guarantees for issue and return operations.

## Author

Developed as a backend project to practise REST API development, database integration, and authentication.
