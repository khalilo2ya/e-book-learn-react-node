import express from "express";
import mysql from "mysql";
import cors from "cors";
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ebook-learn'
});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve the uploaded files statically

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where images will be saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save the file with a timestamp and original extension
    },
});
const upload = multer({ storage: storage });

// Get all books
app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Create a new book with image upload
app.post("/books", upload.single('cover'), (req, res) => {
    const q = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.file ? `/uploads/${req.file.filename}` : null // Store the image path if available
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Book has been created successfully");
    });
});

// Delete book by ID
app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE `id`=?";
    db.query(q, [bookId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Book has been deleted successfully");
    });
});

// Get book by ID
app.get("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "SELECT * FROM books WHERE `id`=?";
    db.query(q, [bookId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Update book with optional image upload
app.put("/books/:id", upload.single('cover'), (req, res) => {
    const bookId = req.params.id;
    const coverPath = req.file ? `/uploads/${req.file.filename}` : req.body.cover;
    const q = "UPDATE books SET `title`=?, `desc`=?, `price`=?, `cover`=? WHERE `id`=?";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        coverPath,
    ];

    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Book has been updated successfully");
    });
});

app.listen(8800, () => {
    console.log("Connected to backend 8800");
});
