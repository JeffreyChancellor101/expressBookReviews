const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user = users.filter(user => user.username === username);
    if(user){
        return true;
    }else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let user = users.filter(user => user.username === username &&
                            user.password === password);
    if(user){
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  if(authenticatedUsers(req.body.username, req.body.password)){
    let token = jwt.sign({data: req.body.username}, 'access', {expiresIn: 60});
    req.session.authorization = {
        "accessToken": token
    };
    res.status(200).json({message: "User was successfully logged in." });
  }else{
    res.status(400).json({message:"User does not exist."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  let review = req.body.review;
  let username = req.body.username;

  if(book && review && username){
    book["reviews"][username] = review;
    return res.status(200).json({message: "Book review has been added." });
  }
  return res.status(400).json({message: "Error adding book review"});
});

// modify a book review
regd_users.put("/auth/review/modify/:isbn", (req, res) => {
    //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  let review = req.body.review;
  let username = req.body.username;

  if(book && review && username){
    book["reviews"][username] = review;
    return res.status(200).json({message: "Book review has been modified." });
  }
  return res.status(400).json({message: "Error modifying book review."});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
