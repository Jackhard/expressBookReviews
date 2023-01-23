const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [
{
	username: 'Jack',
	password: 'password',
}
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 
 //////////////////////////////
 let validuser = users.filter((user) =>{
	 return (user.username === username)
 });
 if (validuser.length > 0) {
	 return true;
 } else {
	 return false;
 } 
 ///////////////////////////////
 }

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
 let validusers = users.filter((user) =>{
	 return (user.username === username && user.password === password)
 });
 if (validusers.length > 0) {
	 return true;
 } else {
	 return false;
 } 
 ///////////////////////////////
 }
 
 regd_users.use(
	session({secret: 'choblya', resave : true, saveUninitialized : true})
 )



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
////////////////////////////
	const username = req.body.username;
	const password = req.body.password;
	
	if (!username || !password) {
		return res.status(404).json({message: "Error log in."});
	}
	
	if (authenticatedUser(username, password)){
		let accessToken = jwt.sign ({
			data: password
		}, 'access', {expiresIn: 60 * 60});
		
		req.session.authorizition = {
			accessToken, username
		}
		return res.status(200).send("User successfully logged in");
	} else {
		return res.status(208).json({message: "Invalid Login1. Check username and password"});
	}
/////////////////////////////////  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
/*  
  const isbn = req.params.isbn;
  let book = books[isbn];
  let review = req.body.review;
  res.send(req.body.review);
  if (review){
	  book["review"] = review;
	   
  }
  books[isbn] = book;
  res.send(book);
*/
  
  
  
  
return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
