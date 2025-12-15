const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require('axios');


public_users.post("/register", (req,res) => {
  let {username, password} = req.body;
  if(username && password){
    if(isValid(username) === true){
        return res.status(400).json({message: "User already exists."})
    }else{
        users.push({username, password});
        return res.status(200).json({message: "User successfully registered."})
    }
  }
  res.status(400).json({message: "Error registering user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    let response = await axios.get("https://localhost:5000/all")
    return res.status(200).send(response.data);
});

// get all books
public_users.get("/all", (req, res) => {
    return res.status(200).send(JSON.stringify(books, null, 4));
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  let response = await axios.get(`https://localhost:5000/async/${isbn}`);
    return res.send(data);
 });

 public_users.get('/async/:isbn', function(req, res){
    let book = books[req.params.isbn];
    if(book){
        return res.status(200).send(JSON.stringify(book, null, 4));
    }
        return res.status(400).json({message: "Book not found."})
 })
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let booklist = [];
  for(let isbn in books){
    if(books[isbn].author === author){
        booklist.push(books[isbn]);
    }
  }
  if(booklist){
    return res.status(200).json(booklist);
  }
  return res.status(300).json({message: "No book with this author."});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  let title = req.params.title;
  let booklist = [];
  for(let isbn in books){
    if(books[isbn].title === title){
        booklist.push(books[isbn]);
    }
  }
  if(booklist.length > 0){
    return res.status(200).json(booklist);
  }
  return res.status(300).json({message: "No book with this title."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    return res.status(200).json(book.reviews);
  }
  return res.status(300).json({message: "No book with this isbn."});
});

module.exports.general = public_users;
