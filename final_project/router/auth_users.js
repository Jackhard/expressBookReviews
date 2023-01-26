const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')
const axios = require('axios')
//const public_users = express.Router()

let users = [
{
	username: 'Jack',
	password: 'password',
},
{
	username: 'Tony',
	password: 'password1',
},
];



//////////////////////////////
const isValid = (username)=>{ 
//returns boolean
//write code to check is the username is valid
  const validuser = users.filter((user) =>{
	 return (user.username === username)
 });
 if (validuser.length > 0) {
	 return true;
 } else {
	 return false;
 } 
 }
 ///////////////////////////////
 
 
 
/////////////////////////////
const authenticatedUser = async (username,password)=>{ 
//returns boolean
//write code to check if username and password match the one we have in records.
 const validuser = await users.filter((user) =>{
	 return (user.username === username && user.password === password)
 });
 if (validuser.length > 0) {
	 return true;
 } else {
	 return false;
 } 
 }
  ///////////////////////////////
  
  
////////////////////////////////// 
 const doesExist = async (username)=> {
	let usernamewithsamename = await users.filter ((user)=>{
		return user.username === username
	});
	if (usernamewithsamename.length > 0) {
		return true;
	} else {
		return false;
	}	
}
///////////////////////////////////


 regd_users.use(
	session({secret: 'fingerprint_customer', resave : true, saveUninitialized : true})
 )




//////////////////////////////////////
//only registered users can login
regd_users.post("/login", async (req,res) => {
  //Write your code here
////////////////////////////
	const username = req.body.username;
	const password = req.body.password;
	
	if (!username || !password) {
		return res.status(404).json({message: "Error log in!"});
	}
	
	if (authenticatedUser(username, password)){
		let accessToken = jwt.sign ({
			data: password
		}, 'access', {expiresIn: 60 * 60});
		
		req.session.authorizition = await {
			accessToken, username
		}
		return res.status(200).send("User successfully logged in");
	} else {
		return res.status(208).json({message: "Invalid Login1. Check username and password"});
	}
});
///////////////////////////////// 





///////////////////////////////////////////
// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
	
  const username = req.session.authorization.username	

  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          filtered_book['reviews'][reviewer] = review;
          books[isbn] = await filtered_book;
      }
      res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
  }  else{
      res.send("Unable to find this ISBN!");
  }
});
///////////////////////////////////////////////////



///////////////////////////////////////
//Delete book
regd_users.delete('/auth/review/:isbn', async (req, res) => {
	const isbn = req.params.isbn
	const username = req.session.authorization.username
	if (books[isbn]) {
		let book = await books[isbn]
		delete book.reviews[username]
		return res.status(200).send('Review successfully deleted')
	} else {
		return res.status(404).json({message: `ISBN ${isbn} not found`})
	}
})
/////////////////////////////////



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.doesExist = doesExist;
