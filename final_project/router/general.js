const express = require('express')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()
const jwt = require('jsonwebtoken')
const session = require('express-session')
// const axios = require('axios')

let user = []

const doesExist = (username)=> {
	let usernamewithsamename = users.filter ((user)=>{
		return user.username === username
	});
	if (usernamewithsamename.length > 0) {
		return true;
	} else {
		return false;
	}	
}

public_users.use(
	session({secret: 'choblya', resave : true, saveUninitialized : true})
)



public_users.post("/register", (req,res) => {
  //Write your code here
//////////////////////////////////////
	const username = req.body.username;
	const password = req.body.password;
	
	if (username && password) {
		if (!doesExist(username)) {
			user.push ({"username":username, "password":password});
			return res.status(200).json({message: "User " + username+" successfully registred. Now you can login" });
		} else {
			return res.status(404).json({message: "User " + username + " already exists!"});
		}
	}
	return res.status(404).json({message: "Unable to register user."});

/////////////////////////////////  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
  ////////////////////////////
  res.send (JSON.stringify(books, null, 4));
  
  ///////////////////////////
  
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
//////////////////////////////
	const isbn = req.params.isbn;
	let book = books[isbn]
	
	res.send (book)

//////////////////////////////

 });
  
// Get book details based on author

const findAuthor = async author => {
	try {
		if (author) {
			const AuthBook = []
			Object.values(books).map(book => {
				if (book.author === author) {
					AuthBook.push(book)
				}
			})
			return Promise.resolve(AuthBook)
		} else {
			return Promise.reject(
				new Error('Could not retrieve Author Promise.')
			)
		}
	} catch (error) {
		console.log(error)
	}
}


public_users.get('/author/:author', async (req, res) => {
	const author = req.params.author
	const data = await findAuthor(author)
	res.send(data)
})


// Get all books based on title
//// My code

const findTitle = async title => {
	try {
		if (title) {
			const newTitleArray = []
			Object.values(books).map(book => {
				if (book.title === title) {
					newTitleArray.push(book)
				}
			})
			return Promise.resolve(newTitleArray)
		} else {
			return Promise.reject(
				new Error('Could not retrieve Title Promise.')
			)
		}
	} catch (error) {
		console.log(error)
	}
}
//////


public_users.get('/title/:title', async (req, res) => {
	const title = req.params.title
	const data = await findTitle(title)
	res.send(data)
})

/*
const findReview = async review => {
	try {
		const isbn = req.params.isbn;
		if (isbn) {
			const newReviewArray = []
			Object.values(books).ma
		}
	}
}
*/

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
	//let book = books[isbn]
	let book = books[isbn];
	if (book){
		let reviews = await book["reviews"];
	res.send (book.reviews);
	}
	
  
  
  
  
//  return res.status(300).json({message: "Yet to be implemented"});
});
//////////////////////////////////////////
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


///////////////////////////////////////////




public_users.post("/login", (req,res) => {
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
		return res.status(200).send("User " + username + " successfully logged in");
	} else {
		return res.status(208).json({message: "Invalid Login2. Check username and password"});
	}





/////////////////////////////////  
  
  
  
//  return res.status(300).json({message: "Yet to be implemented"});
});



module.exports.general = public_users;
