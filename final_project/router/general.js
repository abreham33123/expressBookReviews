const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require("axios");

// Task 10: Get all books using async/await and Promise
public_users.get("/async/books", async (req, res) => {
  try {
    const getBooks = () =>
      new Promise((resolve, reject) => {
        resolve(books);
      });

    const bookList = await getBooks();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Task 11: Get book details by ISBN using async/await and Promise
public_users.get("/async/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = () =>
      new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) resolve(book);
        else reject("Book not found");
      });

    const result = await getBookByISBN();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 12: Get book details by author using async/await and Promise
public_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () =>
      new Promise((resolve, reject) => {
        const matches = Object.values(books).filter(
          (book) => book.author === author
        );
        if (matches.length > 0) resolve(matches);
        else reject("No books found by this author");
      });

    const result = await getBooksByAuthor();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13: Get book details by title using async/await and Promise
public_users.get("/async/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const getBooksByTitle = () =>
      new Promise((resolve, reject) => {
        const matches = Object.values(books).filter(
          (book) => book.title === title
        );
        if (matches.length > 0) resolve(matches);
        else reject("No books found with this title");
      });

    const result = await getBooksByTitle();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Synchronous routes (Tasks 1–4)
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
