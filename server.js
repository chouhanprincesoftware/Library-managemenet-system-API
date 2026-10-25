const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;


const Book = require("./models/Book");
const Student = require("./models/Student");
const Issue = require("./models/issue");
const User = require("./models/User");
const authenticateToken = require("./middleware/auth");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

// Basic route
app.get("/", (req, res) => {
    res.send("Library Management System API is running!");
});


app.post("/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: "Signup successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        return res.status(500).json({
            message: "Server error during signup"
        });
    }
});


app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error during login"
        });
    }
});


app.get("/auth/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: user
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error while fetching profile"
        });
    }
});



// Add a new book
app.post("/books", async (req, res) => {
    try {
        const book = new Book(req.body);

        const savedBook = await book.save();

        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// Get all books
app.get("/books", async (req, res) => {
    console.log("GET /books route hit");
    try {
        const books = await Book.find();

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Update a book
app.put("/books/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(updatedBook);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});



// Delete a book
app.delete("/books/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book deleted successfully",
            book: deletedBook
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// Register a new student
app.post("/students", async (req, res) => {
    try {
        const student = new Student(req.body);

        const savedStudent = await student.save();

        res.status(201).json(savedStudent);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// Get all students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Update a student
app.put("/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(updatedStudent);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// Delete a student
app.delete("/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully",
            student: deletedStudent
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// Issue a book to a student
app.post("/issues", async (req, res) => {
    console.log("POST /issues route hit");
    try {
        const { studentId, bookId } = req.body;

        // Check if student exists
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Check if book exists
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Check available copies
        if (book.availableCopies <= 0) {
            return res.status(400).json({
                message: "Book is not available"
            });
        }

        // Create issue record
        const issue = new Issue({
            student: student._id,
            book: book._id
        });

        const savedIssue = await issue.save();

        // Reduce available copies
        book.availableCopies -= 1;
        await book.save();

        res.status(201).json({
            message: "Book issued successfully",
            issue: savedIssue,
            availableCopies: book.availableCopies
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Get all issue records
app.get("/issues", async (req, res) => {
    try {
        const issues = await Issue.find()
            .populate("student", "name email studentId")
            .populate("book", "title author");

        res.status(200).json(issues);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Return a book
app.put("/issues/:id/return", async (req, res) => {
    try {
        // Find the issue record
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue record not found"
            });
        }

        // Check if the book is already returned
        if (issue.isReturned) {
            return res.status(400).json({
                message: "Book has already been returned"
            });
        }

        // Find the book
        const book = await Book.findById(issue.book);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Update issue record
        issue.isReturned = true;
        issue.returnDate = new Date();
        await issue.save();

        // Increase available copies
        book.availableCopies += 1;
        await book.save();

        res.status(200).json({
            message: "Book returned successfully",
            issue: issue,
            availableCopies: book.availableCopies
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});




// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

